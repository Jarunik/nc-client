<template>
  <div class="fleet">
    <h1>{{ $t("Fleet") }}</h1>
    <template v-if="routeUser !== gameUser">
      <p>
        {{ $t("User: ") + routeUser }}
        <template v-if="routeUser !== planetId">
          <br />{{ $t("Planet: ") + routePlanet }}
        </template>
      </p>
    </template>
    <template
      v-if="
        routeUser !== 'null' &&
          routePlanet != 'null' &&
          sortedFleet !== null &&
          sortedFleet.length > 0
      "
    >
      <table>
        <thead>
          <th @click="sort('id')">{{ $t("Ship") }}</th>
          <th @click="sort('longname')">{{ $t("Name") }}</th>
          <th @click="sort('speed')">{{ $t("Speed") }}</th>
          <th @click="sort('cons')">{{ $t("Consumption") }}</th>
          <th @click="sort('capacity')">{{ $t("Capacity") }}</th>
          <th @click="sort('busy')">{{ $t("Busy") }}</th>
        </thead>
        <tbody>
          <tr v-for="ship in sortedFleet" :key="ship.id">
            <td>{{ $t(ship.id) }}</td>
            <td>{{ $t(ship.longname) }}</td>
            <td>{{ $t(ship.speed) }}</td>
            <td>{{ $t(ship.cons) }}</td>
            <td>{{ $t(ship.capacity) }}</td>
            <td>{{ ship.busy | busyPretty }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <template v-if="routeUser === 'null'">
        <p>
          {{ $t("Please set the") }}
          <router-link to="/user">{{ $t("user") }}</router-link>
        </p>
      </template>
      <template v-if="routePlanet === 'null'"
        ><p>
          {{ $t("Please set the") }}
          <router-link :to="'/' + routeUser + '/planets'">{{
            $t("planet")
          }}</router-link>
        </p>
      </template>
      <template v-if="routeUser !== 'null'">
        <p>
          {{ $t("You have no ships. Buy some in the") }}
          <router-link :to="'/' + gameUser + '/' + planetId + '/shipyard'">{{
            $t("Shipyard")
          }}</router-link>
          .
        </p>
      </template>
    </template>
  </div>
</template>

<script>
import FleetService from "@/services/fleet";
import QuantityService from "@/services/quantity";
import { mapState } from "vuex";
import moment from "moment";

export default {
  name: "fleet",
  props: ["routeUser", "routePlanet"],
  data: function() {
    return {
      fleet: null,
      quantity: null,
      interval: null,
      coal: null,
      ore: null,
      copper: null,
      uranium: null,
      clicked: [],
      chainResponse: [],
      currentSort: "name",
      currentSortDir: "asc"
    };
  },
  async mounted() {
    await this.prepareComponent();
    this.interval = setInterval(() => {
      this.calculateCoal();
      this.calculateOre();
      this.calculateCopper();
      this.calculateUranium();
    }, 1000);
  },
  filters: {
    busyPretty(busy) {
      var busyUntil = moment(new Date(busy * 1000));
      var now = moment.utc();
      if (busy === 0) {
        return "-";
      } else {
        if (now.isAfter(busyUntil)) {
          return "-";
        } else {
          return moment.duration(now.diff(busyUntil)).humanize();
        }
      }
    },
    timePretty(time) {
      return moment.duration(parseInt(time), "seconds").humanize();
    }
  },
  computed: {
    ...mapState({
      loginUser: state => state.game.loginUser,
      accessToken: state => state.game.accessToken,
      gameUser: state => state.game.user,
      planetId: state => state.planet.id
    }),
    sortedFleet() {
      var sortedFleet = this.fleet;
      if (sortedFleet !== null) {
        return sortedFleet.sort((a, b) => {
          let modifier = 1;
          if (this.currentSortDir === "desc") modifier = -1;
          if (a[this.currentSort] === null) return -1 * modifier;
          if (b[this.currentSort] === null) return 1 * modifier;
          if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
          if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          return 0;
        });
      } else {
        return sortedFleet;
      }
    }
  },
  methods: {
    async prepareComponent() {
      await this.getFleet();
      await this.getQuantity();
    },
    async getFleet() {
      const response = await FleetService.all(this.routeUser, this.routePlanet);
      this.fleet = response;
    },
    isBusy(busy) {
      var busyUntil = moment(new Date(busy * 1000));
      var now = moment.utc();
      if (busyUntil === 0) {
        return false;
      } else {
        if (now.isAfter(busyUntil)) {
          return false;
        } else {
          return true;
        }
      }
    },
    async getQuantity() {
      const response = await QuantityService.get(this.planetId);
      this.quantity = response;
      this.calculateCoal();
      this.calculateOre();
      this.calculateCopper();
      this.calculateUranium();
    },
    calculateQuantity(quantity, depot, rate, lastUpdate) {
      var startTime = moment.unix(parseInt(lastUpdate));
      var endTime = moment.utc();
      var duration = moment.duration(endTime.diff(startTime));
      var diff = duration.asDays();

      return Math.max(
        Math.min(
          parseFloat(quantity) + parseFloat(rate) * diff, // accumulation
          parseFloat(depot) // below depot
        ),
        parseFloat(quantity) // or overflow above depot
      ).toFixed(1);
    },
    calculateCoal() {
      if (this.quantity !== null) {
        this.coal = this.calculateQuantity(
          this.quantity.coal,
          this.quantity.coaldepot,
          this.quantity.coalrate,
          this.quantity.lastUpdate
        );
      } else {
        this.coal = 0;
      }
    },
    calculateOre() {
      if (this.quantity !== null) {
        this.ore = this.calculateQuantity(
          this.quantity.ore,
          this.quantity.oredepot,
          this.quantity.orerate,
          this.quantity.lastUpdate
        );
      } else {
        this.ore = 0;
      }
    },
    calculateCopper() {
      if (this.quantity !== null) {
        this.copper = this.calculateQuantity(
          this.quantity.copper,
          this.quantity.copperdepot,
          this.quantity.copperrate,
          this.quantity.lastUpdate
        );
      } else {
        this.copper = 0;
      }
    },
    calculateUranium() {
      if (this.quantity !== null) {
        this.uranium = this.calculateQuantity(
          this.quantity.uranium,
          this.quantity.uraniumdepot,
          this.quantity.uraniumrate,
          this.quantity.lastUpdate
        );
      } else {
        this.uranium = 0;
      }
    },
    sort(s) {
      //if s == current sort, reverse
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      }
      this.currentSort = s;
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

<style>
table {
  margin-left: auto;
  margin-right: auto;
}
</style>

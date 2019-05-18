<template>
  <div class="buildings">
    <h1>{{ $t("Buildings") }}</h1>
    <template v-if="routeUser !== gameUser">
      <p>
        {{ $t("User: ") + routeUser }}
        <template v-if="routeUser !== planetId">
          <br />{{ $t("Planet: ") + routePlanet }}
        </template>
      </p>
    </template>
    <template v-if="routeUser !== 'null' && routePlanet != 'null'">
      <table>
        <thead>
          <th @click="sort('name')">{{ $t("Building") }}</th>
          <th @click="sort('current')">{{ $t("Level") }}</th>
          <th @click="sort('coal')">{{ $t("Coal") }}</th>
          <th @click="sort('ore')">{{ $t("Ore") }}</th>
          <th @click="sort('copper')">{{ $t("Copper") }}</th>
          <th @click="sort('uranium')">{{ $t("Uranium") }}</th>
          <th @click="sort('time')">{{ $t("Needs") }}</th>
          <th @click="sort('busy')">{{ $t("Upgrading") }}</th>
          <th v-if="loginUser !== null && loginUser === gameUser">
            {{ $t("Upgrade") }}
          </th>
          <th>{{ $t(" ") }}</th>
        </thead>
        <tbody>
          <tr v-for="(building, index) in sortedBuildings" :key="building.name">
            <td>{{ $t(building.name) }}</td>
            <td>{{ building.current }}</td>
            <td>{{ building.coal }}</td>
            <td>{{ building.ore }}</td>
            <td>{{ building.copper }}</td>
            <td>{{ building.uranium }}</td>
            <td>
              {{ building.time | timePretty }}
            </td>
            <td>{{ building.busy | busyPretty }}</td>
            <td v-if="loginUser !== null && loginUser === gameUser">
              <button
                :disabled="clicked.includes(building.name)"
                v-if="buildingPossible(building, index)"
                @click="upgradeBuilding(building, index)"
              >
                ↑
              </button>
            </td>
            <td v-if="chainResponse.includes(building.name)">
              {{ $t("⌛") }}
            </td>
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
    </template>
  </div>
</template>

<script>
import BuildingService from "@/services/buildings";
import QuantityService from "@/services/quantity";
import SteemConnectService from "@/services/steemconnect";
import { mapState } from "vuex";
import moment from "moment";

export default {
  name: "buildings",
  props: ["routeUser", "routePlanet"],
  data: function() {
    return {
      buildings: null,
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
    sortedBuildings() {
      var sortedBuildings = this.buildings;
      if (sortedBuildings !== null) {
        return sortedBuildings.sort((a, b) => {
          let modifier = 1;
          if (this.currentSortDir === "desc") modifier = -1;
          if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
          if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          return 0;
        });
      } else {
        return sortedBuildings;
      }
    }
  },
  methods: {
    async prepareComponent() {
      await this.getBuildings();
      await this.getQuantity();
    },
    async getBuildings() {
      const response = await BuildingService.all(this.routePlanet);
      this.buildings = response;
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
    upgradeBuilding(building) {
      this.clicked.push(building.name);
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.upgradeBuilding(
        this.loginUser,
        this.planetId,
        building.name,
        (error, result) => {
          if (error === null && result.success) {
            this.chainResponse.push(building.name);
          }
        }
      );
    },
    buildingPossible(building) {
      if (this.isBusy(building.busy)) {
        return false;
      }
      if (this.coal < building.coal) {
        return false;
      }
      if (this.ore < building.ore) {
        return false;
      }
      if (this.copper < building.copper) {
        return false;
      }
      if (this.uranium < building.uranium) {
        return false;
      }
      if (this.current >= this.skill) {
        return false;
      }
      return true;
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

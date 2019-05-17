<template>
  <div class="buildings">
    <h1>{{ $t("Buildings") }}</h1>
    <template v-if="user !== this.$store.state.game.user">
      <p>
        {{ $t("User: ") + user }}
        <template v-if="user !== this.$store.state.planet.id">
          <br />{{ $t("Planet: ") + planet }}
        </template>
      </p>
    </template>
    <template v-if="user !== 'null' && planet != 'null'">
      <table>
        <thead>
          <th>{{ $t("Building") }}</th>
          <th>{{ $t("Level") }}</th>
          <th>{{ $t("Coal") }}</th>
          <th>{{ $t("Ore") }}</th>
          <th>{{ $t("Copper") }}</th>
          <th>{{ $t("Uranium") }}</th>
          <th>{{ $t("Needs") }}</th>
          <th>{{ $t("Upgrading") }}</th>
          <th
            v-if="
              $store.state.game.loginUser !== null &&
                $store.state.game.loginUser === $store.state.game.user
            "
          >
            {{ $t("Upgrade") }}
          </th>
          <th>{{ $t(" ") }}</th>
        </thead>
        <tbody>
          <tr v-for="(building, index) in buildings" :key="building.name">
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
            <td
              v-if="
                $store.state.game.loginUser !== null &&
                  $store.state.game.loginUser === $store.state.game.user
              "
            >
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
      <template v-if="user === 'null'">
        <p>
          {{ $t("Please set the") }}
          <router-link to="/user">{{ $t("user") }}</router-link>
        </p>
      </template>
      <template v-if="planet === 'null'"
        ><p>
          {{ $t("Please set the") }}
          <router-link :to="'/' + user + '/planets'">{{
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
import moment from "moment";

export default {
  name: "buildings",
  props: ["user", "planet"],
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
      chainResponse: []
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
  methods: {
    async prepareComponent() {
      await this.getBuildings();
      await this.getQuantity();
    },
    async getBuildings() {
      const response = await BuildingService.all(this.planet);
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
    upgradeBuilding(building, index) {
      this.clicked.push(building.name);
      SteemConnectService.setAccessToken(this.$store.state.game.accessToken);
      SteemConnectService.upgradeBuilding(
        this.$store.state.game.loginUser,
        this.$store.state.planet.id,
        building.name,
        (error, result) => {
          if (error === null) {
            this.chainResponse.push(building.name);
          }
        }
      );
    },
    buildingPossible(building, index) {
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
      const response = await QuantityService.get(this.$store.state.planet.id);
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

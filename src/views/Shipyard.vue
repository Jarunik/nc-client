<template>
  <div class="shipyard">
    <h1>{{ $t("Shipyard") }}</h1>
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
          <th>{{ $t("Ship") }}</th>
          <th>{{ $t("Coal") }}</th>
          <th>{{ $t("Ore") }}</th>
          <th>{{ $t("Copper") }}</th>
          <th>{{ $t("Uranium") }}</th>
          <th>{{ $t("Needs") }}</th>
          <th>{{ $t("Rocket") }}</th>
          <th>{{ $t("Bullet") }}</th>
          <th>{{ $t("Laser") }}</th>
          <th>{{ $t("Structure") }}</th>
          <th>{{ $t("Armor") }}</th>
          <th>{{ $t("Shield") }}</th>
          <th>{{ $t("Constructing") }}</th>
          <th
            v-if="
              $store.state.game.loginUser !== null &&
                $store.state.game.loginUser === $store.state.game.user
            "
          >
            {{ $t("Construct") }}
          </th>
        </thead>
        <tbody>
          <tr v-for="(ship, index) in shipyard" :key="ship.longname">
            <td>{{ $t(ship.longname) }}</td>
            <td>{{ ship.cost.coal }}</td>
            <td>{{ ship.cost.ore }}</td>
            <td>{{ ship.cost.copper }}</td>
            <td>{{ ship.cost.uranium }}</td>
            <td>
              {{ ship.cost.time | timePretty }}
            </td>
            <td>{{ ship.rocket }}</td>
            <td>{{ ship.bullet }}</td>
            <td>{{ ship.laser }}</td>
            <td>{{ ship.structure }}</td>
            <td>{{ ship.armor }}</td>
            <td>{{ ship.shield }}</td>
            <td>{{ ship.busy_until | busyPretty }}</td>
            <td
              v-if="
                $store.state.game.loginUser !== null &&
                  $store.state.game.loginUser === $store.state.game.user
              "
            >
              <button
                :disabled="clicked.includes(ship.longname)"
                v-if="shipPossible(ship, index)"
                @click="buildShip(ship, index)"
              >
                ↑
              </button>
            </td>
            <td v-if="chainResponse.includes(ship.longname)">
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
import ShipyardService from "@/services/shipyard";
import QuantityService from "@/services/quantity";
import SteemConnectService from "@/services/steemconnect";
import moment from "moment";

export default {
  name: "shipyard",
  props: ["user", "planet"],
  data: function() {
    return {
      shipyard: null,
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
      await this.getShipyard();
      await this.getQuantity();
    },
    async getShipyard() {
      const response = await ShipyardService.all(this.planet);
      this.shipyard = response;
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
    buildShip(ship, index) {
      this.clicked.push(ship.longname);
      SteemConnectService.setAccessToken(this.$store.state.game.accessToken);
      SteemConnectService.buildShip(
        this.$store.state.game.loginUser,
        this.$store.state.planet.id,
        ship.name,
        (error, result) => {
          if (error === null) {
            this.chainResponse.push(ship.longname);
          }
        }
      );
    },
    shipPossible(ship, index) {
      if (this.isBusy(ship.busy_until)) {
        return false;
      }
      if (this.coal < ship.cost.coal) {
        return false;
      }
      if (this.ore < ship.cost.ore) {
        return false;
      }
      if (this.copper < ship.cost.copper) {
        return false;
      }
      if (this.uranium < ship.cost.copper) {
        return false;
      }
      if (ship.cur_level < ship.min_level) {
        return false;
      }
      if (ship.skill < 20) {
        return false;
      }
      if (ship.variant_name === "laser") {
        return false;
      }
      if (ship.variant_name === "bullet") {
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

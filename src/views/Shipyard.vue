<template>
  <div class="shipyard">
    <h1>{{ $t("Shipyard") }} - {{ planetName }}</h1>
    <div v-if="planetId !== null && quantity != null">
      {{ coal }}
      <font v-if="quantity.coaldepot <= coal" color="red">
        <alpha-c-box-icon :title="$t('Coal')" />
      </font>
      <font v-else>
        <alpha-c-box-icon :title="$t('Coal')" />
      </font>
      {{ ore }}
      <font v-if="quantity.oredepot <= ore" color="red">
        <alpha-f-box-icon :title="$t('Ore')" />
        <alpha-e-box-icon :title="$t('Ore')" />
      </font>
      <font v-else>
        <alpha-f-box-icon :title="$t('Ore')" />
        <alpha-e-box-icon :title="$t('Ore')" />
      </font>
      {{ copper }}
      <font v-if="quantity.copperdepot <= copper" color="red">
        <alpha-c-box-icon :title="$t('Copper')" />
        <alpha-u-box-icon :title="$t('Copper')" />
      </font>
      <font v-else>
        <alpha-c-box-icon :title="$t('Copper')" />
        <alpha-u-box-icon :title="$t('Copper')" />
      </font>
      {{ uranium }}
      <font v-if="quantity.uraniumdepot <= uranium" color="red">
        <alpha-u-box-icon :title="$t('Uranium')" />
      </font>
      <font v-else>
        <alpha-u-box-icon :title="$t('Uranium')" />
      </font>
    </div>
    <p>
      <span @click="setFilter('all')"
        ><font v-if="filter === 'all'" color="green">{{ $t("All") }}</font
        ><font v-else>{{ $t("All") }}</font></span
      >
      |
      <span @click="setFilter('active')"
        ><font v-if="filter === 'active'" color="green">{{ $t("Active") }}</font
        ><font v-else>{{ $t("Active") }}</font></span
      >
    </p>
    <template v-if="gameUser !== 'null' && planetId != 'null'">
      <table>
        <thead>
          <th @click="sort('longname')">{{ $t("Ship") }}</th>
          <th @click="sort('min_level')">{{ $t("Need") }}</th>
          <th @click="sort('cur_level')">{{ $t("Yard") }}</th>
          <th @click="sort('skill')">{{ $t("Skill") }}</th>
          <th @click="sort('coal')">{{ $t("C") }}</th>
          <th @click="sort('ore')">{{ $t("Fe") }}</th>
          <th @click="sort('copper')">{{ $t("Cu") }}</th>
          <th @click="sort('uranium')">{{ $t("U") }}</th>
          <th @click="sort('stardust')">{{ $t("SD") }}</th>
          <th @click="sort('time')">{{ $t("Needs") }}</th>
          <th @click="sort('attack')">{{ $t("A/D") }}</th>
          <th @click="sort('busy_until')">{{ $t("Busy") }}</th>
          <th v-if="loginUser !== null && loginUser === gameUser">
            {{ $t("Build") }}
          </th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="ship in sortedShipyard" :key="ship.longname">
            <td>
              <font v-if="ship.activated === true || ship.variant === 0">{{
                $t(ship.longname)
              }}</font
              ><font v-else color="grey">{{ $t(ship.longname) }}</font>
            </td>
            <td>
              {{ ship.min_level }}
            </td>
            <td>
              <font v-if="ship.cur_level < ship.min_level" color="red">{{
                ship.cur_level
              }}</font
              ><font v-else>{{ ship.cur_level }}</font>
            </td>
            <td>
              <font v-if="ship.skill < 20" color="red">{{
                ship.skill === null ? 0 : ship.skill
              }}</font
              ><font v-else>{{ ship.skill === null ? 0 : ship.skill }}</font>
            </td>
            <td>
              <font v-if="ship.cost.coal > coal" color="red">{{
                ship.cost.coal === 0 ? "-" : ship.cost.coal
              }}</font>
              <font v-else>{{
                ship.cost.coal === 0 ? "-" : ship.cost.coal
              }}</font>
            </td>
            <td>
              <font v-if="ship.cost.ore > ore" color="red">{{
                ship.cost.ore === 0 ? "-" : ship.cost.ore
              }}</font
              ><font v-else>{{
                ship.cost.ore === 0 ? "-" : ship.cost.ore
              }}</font>
            </td>
            <td>
              <font v-if="ship.cost.copper > copper" color="red">{{
                ship.cost.copper === 0 ? "-" : ship.cost.copper
              }}</font
              ><font v-else>{{
                ship.cost.copper === 0 ? "-" : ship.cost.copper
              }}</font>
            </td>
            <td>
              <font v-if="ship.cost.uranium > uranium" color="red">{{
                ship.cost.uranium === 0 ? "-" : ship.cost.uranium
              }}</font
              ><font v-else>{{
                ship.cost.uranium === 0 ? "-" : ship.cost.uranium
              }}</font>
            </td>
            <td>
              <font v-if="ship.cost.stardust > stardust" color="red">{{
                ship.cost.stardust === 0 ? "-" : ship.cost.stardust / 100000000
              }}</font
              ><font v-else>{{
                ship.cost.stardust === 0 ? "-" : ship.cost.stardust / 100000000
              }}</font>
            </td>
            <td>
              {{ ship.cost.time | timePretty }}
            </td>
            <td>
              {{ (ship.rocket + ship.bullet + ship.laser) | omitZero }} /
              {{ ship.structure + ship.armor + ship.shield }}
            </td>
            <td>{{ ship.busy_until | busyPretty }}</td>
            <td v-if="loginUser !== null && loginUser === gameUser">
              <button
                :disabled="clicked.includes(ship.longname) || processing"
                v-if="shipPossible(ship)"
                @click="buildShip(ship)"
              >
                <arrow-up-bold-icon :title="$t('Build')" />
              </button>
            </td>
            <td v-if="chainResponse.includes(ship.longname)">
              <timer-sand-icon :title="$t('Transaction sent')" />
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <template v-if="gameUser === 'null'">
        <p>
          {{ $t("Please set the") }}
          <router-link to="/user">{{ $t("user") }}</router-link>
        </p>
      </template>
      <template v-if="planetId === 'null'"
        ><p>
          {{ $t("Please set the") }}
          <router-link :to="'/planets'">{{ $t("planet") }}</router-link>
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
import { mapState } from "vuex";
import TimerSandIcon from "vue-material-design-icons/TimerSand.vue";
import ArrowUpBoldIcon from "vue-material-design-icons/ArrowUpBold.vue";
import * as types from "@/store/mutation-types";
import AlphaCBoxIcon from "vue-material-design-icons/AlphaCBox.vue";
import AlphaFBoxIcon from "vue-material-design-icons/AlphaFBox.vue";
import AlphaEBoxIcon from "vue-material-design-icons/AlphaEBox.vue";
import AlphaUBoxIcon from "vue-material-design-icons/AlphaUBox.vue";

export default {
  name: "shipyard",
  components: {
    TimerSandIcon,
    ArrowUpBoldIcon,
    AlphaCBoxIcon,
    AlphaFBoxIcon,
    AlphaEBoxIcon,
    AlphaUBoxIcon
  },
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
      chainResponse: [],
      currentSort: "longname",
      currentSortDir: "asc",
      processing: false,
      filter: "active"
    };
  },
  async mounted() {
    this.clicked = [];
    this.chainResponse = [];
    await this.prepareComponent();
    this.interval = setInterval(() => {
      this.calculateCoal();
      this.calculateOre();
      this.calculateCopper();
      this.calculateUranium();
    }, 1000);
    this.$store.subscribe(mutation => {
      switch (mutation.type) {
        case "planet/" + types.SET_PLANET_ID:
          this.clicked = [];
          this.chainResponse = [];
          this.prepareComponent();
      }
    });
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
    },
    omitZero(number) {
      if (number == 0) {
        return "-";
      }
      return number;
    }
  },
  computed: {
    ...mapState({
      loginUser: state => state.game.loginUser,
      accessToken: state => state.game.accessToken,
      gameUser: state => state.game.user,
      planetId: state => state.planet.id,
      planetName: state => state.planet.name
    }),
    sortedShipyard() {
      var sortedShipyard = this.shipyard;
      if (sortedShipyard !== null) {
        sortedShipyard = sortedShipyard.sort((a, b) => {
          let modifier = 1;
          if (this.currentSortDir === "desc") modifier = -1;
          if (a[this.currentSort] === null) return -1 * modifier;
          if (b[this.currentSort] === null) return 1 * modifier;
          // cost
          if (
            this.currentSort === "coal" ||
            this.currentSort === "ore" ||
            this.currentSort === "copper" ||
            this.currentSort === "uranium" ||
            this.currentSort === "time"
          ) {
            if (a.cost[this.currentSort] < b.cost[this.currentSort])
              return -1 * modifier;
            if (a.cost[this.currentSort] > b.cost[this.currentSort])
              return 1 * modifier;
            // attack
          } else if (this.currentSort === "attack") {
            if (a.rocket + a.bullet + a.laser < b.rocket + b.bullet + b.laser)
              return -1 * modifier;
            if (a.rocket + a.bullet + a.laser > b.rocket + b.bullet + b.laser)
              return 1 * modifier;
            // defense
          } else if (this.currentSort === "defense") {
            if (
              a.structure + a.armor + a.shield <
              b.structure + b.armor + b.shield
            )
              return -1 * modifier;
            if (
              a.structure + a.armor + a.shield >
              b.structure + b.armor + b.shield
            )
              return 1 * modifier;
            // all the others
          } else {
            if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
            if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          }
          return 0;
        });
      } else {
        null;
      }
      if (this.filter === "all") {
        return sortedShipyard;
      } else {
        return this._.filter(
          sortedShipyard,
          ship => ship.activated == true || ship.variant === 0
        );
      }
    }
  },
  methods: {
    async prepareComponent() {
      await this.getShipyard();
      await this.getQuantity();
    },
    async getShipyard() {
      const response = await ShipyardService.all(this.planetId);
      this.shipyard = response;
    },
    isBusy(busy) {
      var busyUntil = moment(new Date(busy * 1000));
      var now = moment.utc();
      if (busyUntil === 0 || busy === null) {
        return false;
      } else {
        if (now.isAfter(busyUntil)) {
          return false;
        } else {
          return true;
        }
      }
    },
    buildShip(ship) {
      let self = this;
      self.processing = true;
      this.clicked.push(ship.longname);
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.buildShip(
        this.loginUser,
        this.planetId,
        ship.type,
        (error, result) => {
          if (error === null && result.success) {
            self.handleCallback(self, ship);
          }
        }
      );
      // For non-working callbacks
      setTimeout(function() {
        self.handleCallback(self, ship);
      }, 700);
    },
    handleCallback(self, ship) {
      if (self.processing) {
        self.chainResponse.push(ship.longname);
        self.quantity.coal = self.quantity.coal - ship.cost.coal;
        self.quantity.ore = self.quantity.ore - ship.cost.ore;
        self.quantity.copper = self.quantity.copper - ship.cost.copper;
        self.quantity.uranium = self.quantity.uranium - ship.cost.uranium;
        self.processing = false;
      }
    },
    shipPossible(ship) {
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
      if (this.uranium < ship.cost.uranium) {
        return false;
      }
      if (ship.cur_level < ship.min_level) {
        return false;
      }
      if (ship.activated === false && ship.variant !== 0) {
        return false;
      }
      if (ship.skill < 20) {
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
    },
    async setFilter(filter) {
      if (this.filter === filter) {
        return;
      }
      this.filter = filter;
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

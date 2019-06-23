<template>
  <div class="buildings">
    <h1>{{ $t("Buildings") }}</h1>
    <template v-if="gameUser !== 'null' && planetId != 'null'">
      <table>
        <thead>
          <th @click="sort('name')">{{ $t("Building") }}</th>
          <th @click="sort('current')">{{ $t("Level") }}</th>
          <th @click="sort('skill')">{{ $t("Skill") }}</th>
          <th @click="sort('coal')">{{ $t("C") }}</th>
          <th @click="sort('ore')">{{ $t("Fe") }}</th>
          <th @click="sort('copper')">{{ $t("Cu") }}</th>
          <th @click="sort('uranium')">{{ $t("U") }}</th>
          <th @click="sort('time')">{{ $t("Needs") }}</th>
          <th @click="sort('busy')">{{ $t("Busy") }}</th>
          <th v-if="loginUser !== null && loginUser === gameUser">
            {{ $t("Upgrade") }}
          </th>
          <th v-if="loginUser !== null && loginUser === gameUser">
            {{ $t("Charge") }}
          </th>
          <th v-if="loginUser !== null && loginUser === gameUser">
            {{ $t("Activate") }}
          </th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="(building, index) in sortedBuildings" :key="building.name">
            <td>{{ $t(building.name) }}</td>
            <td>
              {{ building.current }}
            </td>
            <td>
              <font v-if="building.current === building.skill" color="red">
                {{ building.skill }}
              </font>
              <font v-else> {{ building.skill }}</font>
            </td>
            <td>
              <font v-if="building.coal > coal" color="red">{{
                building.coal === 0 ? "-" : building.coal
              }}</font>
              <font v-else>{{
                building.coal === 0 ? "-" : building.coal
              }}</font>
            </td>
            <td>
              <font v-if="building.ore > ore" color="red">{{
                building.ore === 0 ? "-" : building.ore
              }}</font
              ><font v-else>{{ building.ore === 0 ? "-" : building.ore }}</font>
            </td>
            <td>
              <font v-if="building.copper > copper" color="red">{{
                building.copper === 0 ? "-" : building.copper
              }}</font
              ><font v-else>{{
                building.copper === 0 ? "-" : building.copper
              }}</font>
            </td>
            <td>
              <font v-if="building.uranium > uranium" color="red">{{
                building.uranium === 0 ? "-" : building.uranium
              }}</font
              ><font v-else>{{
                building.uranium === 0 ? "-" : building.uranium
              }}</font>
            </td>
            <td>
              {{ building.time | timePretty }}
            </td>
            <td>{{ building.busy | busyPretty }}</td>
            <td>
              <span
                v-if="
                  loginUser !== null &&
                    loginUser === gameUser &&
                    building.current < 20
                "
              >
                <button
                  :disabled="clicked.includes(building.name)"
                  v-if="buildingPossible(building)"
                  @click="upgradeBuilding(building, index)"
                >
                  <arrow-up-bold-icon :title="$t('Upgrade')" />
                </button>
              </span>
              <span v-else> <check-outline-icon :title="$t('Maxed')" /> </span>
            </td>
            <td>
              <button
                :disabled="clicked.includes(building.name)"
                v-if="
                  loginUser !== null &&
                    loginUser === gameUser &&
                    building.name === 'shieldgenerator' &&
                    chargePossible(building, index)
                "
                @click="charge(building, index)"
              >
                <refresh-icon :title="$t('Charge')" />
              </button>
            </td>
            <td>
              <span
                v-if="
                  loginUser !== null &&
                    loginUser === gameUser &&
                    building.name === 'shieldgenerator' &&
                    enablePossible(building, index)
                "
              >
                <button
                  :disabled="clicked.includes(building.name)"
                  v-if="enablePossible(building, index)"
                  @click="enable(building, index)"
                >
                  <white-balance-sunny-icon :title="$t('Enable')" />
                </button>
                <span v-if="isBusy(building.misc.shieldprotection_busy)"
                  ><shield-icon :title="$t('Protected')"
                /></span>
              </span>
            </td>
            <td v-if="chainResponse.includes(building.name)">
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
import BuildingService from "@/services/buildings";
import QuantityService from "@/services/quantity";
import SteemConnectService from "@/services/steemconnect";
import { mapState } from "vuex";
import moment from "moment";
import TimerSandIcon from "vue-material-design-icons/TimerSand.vue";
import ArrowUpBoldIcon from "vue-material-design-icons/ArrowUpBold.vue";
import RefreshIcon from "vue-material-design-icons/Refresh.vue";
import WhiteBalanceSunnyIcon from "vue-material-design-icons/WhiteBalanceSunny.vue";
import CheckOutlineIcon from "vue-material-design-icons/CheckOutline.vue";
import ShieldIcon from "vue-material-design-icons/Shield.vue";
import * as types from "@/store/mutation-types";

export default {
  name: "buildings",
  components: {
    TimerSandIcon,
    ArrowUpBoldIcon,
    RefreshIcon,
    WhiteBalanceSunnyIcon,
    CheckOutlineIcon,
    ShieldIcon
  },
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
          this.prepareComponent();
          this.clicked = [];
          this.chainResponse = [];
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
      if (time === 0) {
        return "-";
      }
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
          if (a[this.currentSort] === null) return -1 * modifier;
          if (b[this.currentSort] === null) return 1 * modifier;
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
      const response = await BuildingService.all(this.planetId);
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
      if (building.skill <= building.current) {
        return false;
      }
      return true;
    },
    chargePossible(building) {
      // TODO Check if charge possible.
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
      if (building.current === 0) {
        return false;
      }
      if (building.misc.shieldcharged === 1) {
        return false;
      }
      if (this.isBusy(building.misc.shieldcharge_busy)) {
        return false;
      }
      return true;
    },
    enablePossible(building) {
      // TODO Check if enable possible.
      if (building.current === 0) {
        return false;
      }
      if (building.misc.shieldcharged !== 1) {
        return false;
      }
      if (this.isBusy(building.misc.shieldprotection_busy)) {
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
    charge(building) {
      this.clicked.push(building.name);
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.charge(
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
    enable(building) {
      this.clicked.push(building.name);
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.enable(
        this.loginUser,
        this.planetId,
        building.name,
        (error, result) => {
          if (error === null && result.success) {
            this.chainResponse.push(building.name);
          }
        }
      );
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

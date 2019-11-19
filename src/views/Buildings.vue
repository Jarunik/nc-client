<template>
  <div class="buildings">
    <h1>
      {{ $t("Buildings") }} {{ planetName }}
      <font color="grey" size="2em">{{ posX }}/{{ posY }}</font>
    </h1>
    <p>
      {{ $t("Next Upgrade") }}: {{ nextEventDuration() || "-" }}
      <br />
      {{ $t("Next Refresh") }}: {{ nextRefreshFormatted() || "-" }}
    </p>
    <div v-if="planetId !== null && quantity != null">
      {{
        Number(coal).toLocaleString(gameLocale, {
          style: "decimal"
        })
      }}
      <font v-if="quantity.coaldepot <= coal" color="red">
        <alpha-c-box-icon :title="$t('Coal')" />
      </font>
      <font v-else>
        <alpha-c-box-icon :title="$t('Coal')" />
      </font>
      {{
        Number(ore).toLocaleString(gameLocale, {
          style: "decimal"
        })
      }}
      <font v-if="quantity.oredepot <= ore" color="red">
        <alpha-f-box-icon :title="$t('Ore')" />
        <alpha-e-box-icon :title="$t('Ore')" />
      </font>
      <font v-else>
        <alpha-f-box-icon :title="$t('Ore')" />
        <alpha-e-box-icon :title="$t('Ore')" />
      </font>
      {{
        Number(copper).toLocaleString(gameLocale, {
          style: "decimal"
        })
      }}
      <font v-if="quantity.copperdepot <= copper" color="red">
        <alpha-c-box-icon :title="$t('Copper')" />
        <alpha-u-box-icon :title="$t('Copper')" />
      </font>
      <font v-else>
        <alpha-c-box-icon :title="$t('Copper')" />
        <alpha-u-box-icon :title="$t('Copper')" />
      </font>
      {{
        Number(uranium).toLocaleString(gameLocale, {
          style: "decimal"
        })
      }}
      <font v-if="quantity.uraniumdepot <= uranium" color="red">
        <alpha-u-box-icon :title="$t('Uranium')" />
      </font>
      <font v-else>
        <alpha-u-box-icon :title="$t('Uranium')" />
      </font>
      <br />
      <br />
    </div>
    <template v-if="gameUser !== null && planetId != null">
      <table>
        <thead>
          <th @click="sort('name')">{{ $t("Building") }}</th>
          <th @click="sort('cur_rate')">{{ $t("Current") }}</th>
          <th @click="sort('next_rate')">{{ $t("Next") }}</th>
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
              {{
                building.cur_rate === null
                  ? "-"
                  : Number(building.cur_rate).toLocaleString(gameLocale, {
                      style: "decimal"
                    })
              }}
            </td>
            <td>
              {{
                building.next_rate === null
                  ? "-"
                  : Number(building.next_rate).toLocaleString(gameLocale, {
                      style: "decimal"
                    })
              }}
            </td>
            <td>
              {{
                Number(building.current).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
            </td>
            <td>
              <font v-if="building.current === building.skill" color="red">{{
                building.skill
              }}</font>
              <font v-else>{{ building.skill }}</font>
            </td>
            <td>
              <font v-if="building.coal > coal" color="red">
                {{
                  building.coal === 0
                    ? "-"
                    : Number(building.coal).toLocaleString(gameLocale, {
                        style: "decimal"
                      })
                }}
              </font>
              <font v-else>
                {{
                  building.coal === 0
                    ? "-"
                    : Number(building.coal).toLocaleString(gameLocale, {
                        style: "decimal"
                      })
                }}
              </font>
            </td>
            <td>
              <font v-if="building.ore > ore" color="red">
                {{
                  building.ore === 0
                    ? "-"
                    : Number(building.ore).toLocaleString(gameLocale, {
                        style: "decimal"
                      })
                }}
              </font>
              <font v-else>
                {{
                  building.ore === 0
                    ? "-"
                    : Number(building.ore).toLocaleString(gameLocale, {
                        style: "decimal"
                      })
                }}
              </font>
            </td>
            <td>
              <font v-if="building.copper > copper" color="red">
                {{
                  building.copper === 0
                    ? "-"
                    : Number(building.copper).toLocaleString(gameLocale, {
                        style: "decimal"
                      })
                }}
              </font>
              <font v-else>
                {{
                  building.copper === 0
                    ? "-"
                    : Number(building.copper).toLocaleString(gameLocale, {
                        style: "decimal"
                      })
                }}
              </font>
            </td>
            <td>
              <font v-if="building.uranium > uranium" color="red">
                {{
                  building.uranium === 0
                    ? "-"
                    : Number(building.uranium).toLocaleString(gameLocale, {
                        style: "decimal"
                      })
                }}
              </font>
              <font v-else>
                {{
                  building.uranium === 0
                    ? "-"
                    : Number(building.uranium).toLocaleString(gameLocale, {
                        style: "decimal"
                      })
                }}
              </font>
            </td>
            <td>{{ building.time | timePretty }}</td>
            <td>
              <span v-if="chainResponse.includes(building.name)">
                <timer-sand-icon :title="$t('Transaction sent')" />
                {{ nextRefreshFormatted() }}
              </span>
              <span v-else>{{ building.busy | busyPretty(now) }}</span>
            </td>
            <td>
              <span
                v-if="
                  loginUser !== null &&
                    loginUser === gameUser &&
                    building.current < 20
                "
              >
                <button
                  :disabled="clicked.includes(building.name) || processing"
                  v-if="buildingPossible(building)"
                  @click="upgradeBuilding(building, index)"
                >
                  <arrow-up-bold-icon :title="$t('Upgrade')" />
                </button>
              </span>
              <span v-else>
                <check-outline-icon :title="$t('Maxed')" />
              </span>
            </td>
            <td>
              <button
                :disabled="clicked.includes('charge') || processing"
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
                  :disabled="clicked.includes('enable') || processing"
                  v-if="enablePossible(building, index)"
                  @click="enable(building, index)"
                >
                  <white-balance-sunny-icon :title="$t('Enable')" />
                </button>
                <span v-if="isBusy(building.misc.shieldprotection_busy)">
                  <shield-icon :title="$t('Protected')" />
                </span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <template v-if="gameUser === null">
        <p>{{ $t("Please set the") }} {{ $t("user") }}</p>
      </template>
      <template v-if="planetId === null">
        <p>
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
import AlphaCBoxIcon from "vue-material-design-icons/AlphaCBox.vue";
import AlphaFBoxIcon from "vue-material-design-icons/AlphaFBox.vue";
import AlphaEBoxIcon from "vue-material-design-icons/AlphaEBox.vue";
import AlphaUBoxIcon from "vue-material-design-icons/AlphaUBox.vue";

export default {
  name: "buildings",
  components: {
    TimerSandIcon,
    ArrowUpBoldIcon,
    RefreshIcon,
    WhiteBalanceSunnyIcon,
    CheckOutlineIcon,
    ShieldIcon,
    AlphaCBoxIcon,
    AlphaFBoxIcon,
    AlphaEBoxIcon,
    AlphaUBoxIcon
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
      processing: false,
      currentSort: "name",
      currentSortDir: "asc",
      now: moment.utc(),
      nextRefresh: null
    };
  },
  async mounted() {
    this.clicked = [];
    this.chainResponse = [];
    await this.prepareComponent();
    this.now = moment.utc();
    this.interval = setInterval(() => {
      this.calculateCoal();
      this.calculateOre();
      this.calculateCopper();
      this.calculateUranium();
      this.now = moment.utc();
      if (this.nextRefresh !== null && this.nextRefresh.isBefore(this.now)) {
        this.refreshFromApi();
      }
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
    busyPretty(busy, now) {
      var busyUntil = moment(new Date(busy * 1000));
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
      planetId: state => state.planet.id,
      planetName: state => state.planet.name,
      posX: state => state.planet.posX,
      posY: state => state.planet.posY,
      gameLocale: state => state.game.gameLocale
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
      if (this.$route.name == "buildings") {
        await this.getBuildings();
        await this.getQuantity();
      }
    },
    async getBuildings() {
      const response = await BuildingService.all(this.planetId);
      this.buildings = response;
    },
    isBusy(busy) {
      var busyUntil = moment(new Date(busy * 1000));
      if (busyUntil === 0) {
        return false;
      } else {
        if (this.now.isAfter(busyUntil)) {
          return false;
        } else {
          return true;
        }
      }
    },
    upgradeBuilding(building) {
      this.processing = true;
      let self = this;
      let currentBuilding = building;
      self.clicked.push(currentBuilding.name);
      SteemConnectService.setAccessToken(self.accessToken);
      SteemConnectService.upgradeBuilding(
        self.loginUser,
        self.planetId,
        currentBuilding.name,
        (error, result) => {
          if (error === null && result.success) {
            self.callbackHandling(self, currentBuilding);
          }
        }
      );
      // For non-working callbacks
      setTimeout(function() {
        self.callbackHandling(self, currentBuilding);
      }, 700);
    },
    callbackHandling(self, currentBuilding) {
      // Only do it once
      if (self.processing) {
        self.chainResponse.push(currentBuilding.name);
        self.quantity.coal = self.quantity.coal - currentBuilding.coal;
        self.quantity.ore = self.quantity.ore - currentBuilding.ore;
        self.quantity.copper = self.quantity.copper - currentBuilding.copper;
        self.quantity.uranium = self.quantity.uranium - currentBuilding.uranium;
        self.processing = false;
        this.nextRefresh = moment.utc().add(6, "seconds");
      }
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
      this.processing = true;
      this.clicked.push("charge");
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.charge(
        this.loginUser,
        this.planetId,
        building.name,
        (error, result) => {
          if (error === null && result.success) {
            this.chainResponse.push(building.name);
            this.processing = false;
          }
        }
      );
      setTimeout(function() {
        this.processing = false;
      }, 700);
    },
    enable(building) {
      this.processing = true;
      this.clicked.push("enable");
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.enable(
        this.loginUser,
        this.planetId,
        building.name,
        (error, result) => {
          if (error === null && result.success) {
            this.chainResponse.push(building.name);
            this.processing = false;
          }
        }
      );
      setTimeout(function() {
        this.processing = false;
      }, 700);
    },
    nextEventDuration() {
      let nextEvent = null;
      if (this.buildings !== null) {
        this.buildings.forEach(building => {
          let busy = moment(new Date(building.busy * 1000));
          if (nextEvent === null) {
            if (busy !== null && busy.isAfter(this.now)) {
              nextEvent = busy;
            }
          }

          if (
            nextEvent !== null &&
            nextEvent.isAfter(busy) &&
            busy.isAfter(this.now)
          ) {
            nextEvent = moment(busy);
          }
        });
        if (nextEvent === null) {
          return null;
        }
        let duration = this.moment.duration(nextEvent.diff(this.now));
        //Get Days and subtract from duration
        let days = ("0" + duration.days()).slice(-2);
        duration.subtract(this.moment.duration(days, "days"));

        //Get hours and subtract from duration
        let hours = ("0" + duration.hours()).slice(-2);
        duration.subtract(this.moment.duration(hours, "hours"));

        //Get Minutes and subtract from duration
        let minutes = ("0" + duration.minutes()).slice(-2);
        duration.subtract(this.moment.duration(minutes, "minutes"));

        //Get seconds
        let seconds = ("0" + duration.seconds()).slice(-2);
        return days + ":" + hours + ":" + minutes + ":" + seconds;
      } else {
        return null;
      }
    },
    nextRefreshFormatted() {
      if (this.nextRefresh != null) {
        let duration = this.moment.duration(this.nextRefresh.diff(this.now));

        //Get Days and subtract from duration
        let days = ("0" + duration.days()).slice(-2);
        duration.subtract(this.moment.duration(days, "days"));

        //Get hours and subtract from duration
        let hours = ("0" + duration.hours()).slice(-2);
        duration.subtract(this.moment.duration(hours, "hours"));

        //Get Minutes and subtract from duration
        let minutes = ("0" + duration.minutes()).slice(-2);
        duration.subtract(this.moment.duration(minutes, "minutes"));

        //Get seconds
        let seconds = ("0" + duration.seconds()).slice(-2);
        if (seconds < 0) {
          seconds = "00";
        }
        return minutes + ":" + seconds;
      } else {
        return null;
      }
    },
    async refreshFromApi() {
      await this.getBuildings();
      this.buildings.forEach(building => {
        if (this.chainResponse.includes(building.name)) {
          if (this.isBusy(building.busy)) {
            this.chainResponse = this.chainResponse.filter(value => {
              return value !== building.name;
            });
          }
        }
      });
      if (this.chainResponse.length > 0) {
        this.nextRefresh = moment.utc().add(6, "seconds");
      } else {
        this.clicked = [];
        await this.getQuantity();
        this.nextRefresh = null;
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

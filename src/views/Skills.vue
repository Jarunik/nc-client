<template>
  <div class="skills">
    <h1>{{ $t("Skills") }} - {{ planetName }}</h1>
    <p>
      {{ $t("Next Enhancement") }}: {{ nextEventDuration() || "-" }}<br />
      {{ $t("Next Refresh") }}: {{ nextRefreshFormatted() || "-" }}
    </p>
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
      <br />
      <br />
    </div>
    <template v-if="gameUser !== 'null'">
      <table>
        <thead>
          <th @click="sort('name')">{{ $t("Skill") }}</th>
          <th @click="sort('current')">{{ $t("Level") }}</th>
          <th @click="sort('coal')">{{ $t("C") }}</th>
          <th @click="sort('ore')">{{ $t("Fe") }}</th>
          <th @click="sort('copper')">{{ $t("Cu") }}</th>
          <th @click="sort('uranium')">{{ $t("U") }}</th>
          <th @click="sort('time')">{{ $t("Needs") }}</th>
          <th @click="sort('busy')">{{ $t("Enhancing") }}</th>
          <th v-if="loginUser !== null && loginUser === gameUser">
            {{ $t("Enhance") }}
          </th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="skill in sortedSkills" :key="skill.name">
            <td>{{ $t(skill.name) }}</td>
            <td>{{ skill.current }}</td>
            <td>
              <font v-if="skill.coal > coal" color="red">
                {{ skill.coal === 0 ? "-" : skill.coal }}
              </font>
              <font v-else>{{ skill.coal === 0 ? "-" : skill.coal }}</font>
            </td>
            <td>
              <font v-if="skill.ore > ore" color="red">
                {{ skill.ore === 0 ? "-" : skill.ore }}
              </font>
              <font v-else>{{ skill.ore === 0 ? "-" : skill.ore }}</font>
            </td>
            <td>
              <font v-if="skill.copper > copper" color="red">
                {{ skill.copper === 0 ? "-" : skill.copper }}
              </font>
              <font v-else>{{ skill.copper === 0 ? "-" : skill.copper }}</font>
            </td>
            <td>
              <font v-if="skill.uranium > uranium" color="red">
                {{ skill.uranium === 0 ? "-" : skill.uranium }}
              </font>
              <font v-else>
                {{ skill.uranium === 0 ? "-" : skill.uranium }}
              </font>
            </td>
            <td>{{ skill.time | timePretty }}</td>
            <td>{{ skill.busy | busyPretty(now) }}</td>
            <td>
              <span
                v-if="
                  loginUser !== null &&
                    loginUser === gameUser &&
                    skill.current < 20
                "
              >
                <button
                  :disabled="clicked.includes(skill.name) || processing"
                  v-if="skillPossible(skill)"
                  @click="enhanceSkill(skill)"
                >
                  <arrow-up-bold-icon :title="$t('Enhance')" />
                </button>
              </span>
              <span v-else>
                <span v-if="skill.current > 19">
                  <check-outline-icon :title="$t('Maxed')" />
                </span>
              </span>
            </td>
            <td v-if="chainResponse.includes(skill.name)">
              <timer-sand-icon :title="$t('Transaction sent')" />
              {{ nextRefreshFormatted() }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <p>
        {{ $t("Please set the") }}
        <router-link to="/user">{{ $t("set a user") }}</router-link>
      </p>
    </template>
  </div>
</template>

<script>
import SkillsService from "@/services/skills";
import QuantityService from "@/services/quantity";
import SteemConnectService from "@/services/steemconnect";
import moment from "moment";
import { mapState } from "vuex";
import TimerSandIcon from "vue-material-design-icons/TimerSand.vue";
import ArrowUpBoldIcon from "vue-material-design-icons/ArrowUpBold.vue";
import CheckOutlineIcon from "vue-material-design-icons/CheckOutline.vue";
import * as types from "@/store/mutation-types";
import AlphaCBoxIcon from "vue-material-design-icons/AlphaCBox.vue";
import AlphaFBoxIcon from "vue-material-design-icons/AlphaFBox.vue";
import AlphaEBoxIcon from "vue-material-design-icons/AlphaEBox.vue";
import AlphaUBoxIcon from "vue-material-design-icons/AlphaUBox.vue";

export default {
  name: "skills",
  components: {
    TimerSandIcon,
    ArrowUpBoldIcon,
    CheckOutlineIcon,
    AlphaCBoxIcon,
    AlphaFBoxIcon,
    AlphaEBoxIcon,
    AlphaUBoxIcon
  },
  data: function() {
    return {
      skills: null,
      quantity: null,
      interval: null,
      coal: null,
      ore: null,
      copper: null,
      uranium: null,
      clicked: [],
      chainResponse: [],
      currentSort: "name",
      currentSortDir: "asc",
      processing: false,
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
          this.clicked = [];
          this.chainResponse = [];
          this.prepareComponent();
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
      planetName: state => state.planet.name
    }),
    sortedSkills() {
      var sortedSkills = this.skills;
      if (sortedSkills !== null) {
        return sortedSkills.sort((a, b) => {
          let modifier = 1;
          if (this.currentSortDir === "desc") modifier = -1;
          if (a[this.currentSort] === null) return -1 * modifier;
          if (b[this.currentSort] === null) return 1 * modifier;
          if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
          if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          return 0;
        });
      } else {
        return sortedSkills;
      }
    }
  },
  methods: {
    async prepareComponent() {
      await this.getSkills();
      await this.getQuantity();
    },
    async getSkills() {
      const response = await SkillsService.all(this.gameUser);
      this.skills = response;
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
    enhanceSkill(skill) {
      let self = this;
      this.processing = true;
      this.clicked.push(skill.name);
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.enhanceSkill(
        this.loginUser,
        this.planetId,
        skill.name,
        (error, result) => {
          if (error === null && result.success) {
            self.handleCallback(this, skill);
          }
        }
      );
      // For non-working callbacks
      setTimeout(function() {
        self.handleCallback(self, skill);
      }, 700);
    },
    handleCallback(self, skill) {
      if (self.processing) {
        self.chainResponse.push(skill.name);
        self.quantity.coal = self.quantity.coal - skill.coal;
        self.quantity.ore = self.quantity.ore - skill.ore;
        self.quantity.copper = self.quantity.copper - skill.copper;
        self.quantity.uranium = self.quantity.uranium - skill.uranium;
        self.processing = false;
        this.nextRefresh = moment.utc().add(6, "seconds");
      }
    },
    skillPossible(skill) {
      if (this.isBusy(skill.busy)) {
        return false;
      }
      if (this.coal < skill.coal) {
        return false;
      }
      if (this.ore < skill.ore) {
        return false;
      }
      if (this.copper < skill.copper) {
        return false;
      }
      if (this.uranium < skill.uranium) {
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
    nextEventDuration() {
      let nextEvent = null;
      if (this.skills !== null) {
        this.skills.forEach(skill => {
          let busy = moment(new Date(skill.busy * 1000));
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
      let refresh = false;
      await this.getSkills();
      this.skills.forEach(skill => {
        if (this.chainResponse.includes(skill.name)) {
          if (!this.isBusy(skill.busy)) {
            refresh = true;
          }
        }
      });
      if (refresh) {
        this.nextRefresh = moment.utc().add(6, "seconds");
      } else {
        this.clicked = [];
        this.chainResponse = [];
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

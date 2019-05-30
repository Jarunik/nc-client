<template>
  <div class="skills">
    <h1>{{ $t("Skills") }}</h1>
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
          <th>{{ $t(" ") }}</th>
        </thead>
        <tbody>
          <tr v-for="skill in sortedSkills" :key="skill.name">
            <td>{{ $t(skill.name) }}</td>
            <td>{{ skill.current }}</td>
            <td>{{ skill.coal === 0 ? "-" : skill.coal }}</td>
            <td>{{ skill.ore === 0 ? "-" : skill.ore }}</td>
            <td>{{ skill.copper === 0 ? "-" : skill.copper }}</td>
            <td>{{ skill.uranium === 0 ? "-" : skill.uranium }}</td>
            <td>
              {{ skill.time | timePretty }}
            </td>
            <td>{{ skill.busy | busyPretty }}</td>
            <td>
              <span
                v-if="
                  loginUser !== null &&
                    loginUser === gameUser &&
                    skill.current < 20
                "
              >
                <button
                  :disabled="clicked.includes(skill.name)"
                  v-if="skillPossible(skill)"
                  @click="enhanceSkill(skill)"
                >
                  <arrow-up-bold-icon :title="$t('Enhance')" />
                </button>
              </span>
              <span v-else> <check-outline-icon :title="$t('Maxed')" /> </span>
            </td>
            <td v-if="chainResponse.includes(skill.name)">
              <timer-sand-icon :title="$t('Transaction sent')" />
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

export default {
  name: "skills",
  components: {
    TimerSandIcon,
    ArrowUpBoldIcon,
    CheckOutlineIcon
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
    this.$store.subscribe(mutation => {
      switch (mutation.type) {
        case "planet/" + types.SET_PLANET_ID:
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
      this.clicked.push(skill.name);
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.enhanceSkill(
        this.loginUser,
        this.planetId,
        skill.name,
        (error, result) => {
          if (error === null && result.success) {
            this.chainResponse.push(skill.name);
          }
        }
      );
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
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

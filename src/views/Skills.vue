<template>
  <div class="skills">
    <h1>{{ $t("Skills") }}</h1>
    <template v-if="user !== this.$store.state.game.user">
      <p>
        {{ $t("User: ") + user }}
      </p>
    </template>
    <template v-if="user !== 'null'">
      <table>
        <thead>
          <th>{{ $t("Skill") }}</th>
          <th>{{ $t("Level") }}</th>
          <th>{{ $t("Coal") }}</th>
          <th>{{ $t("Ore") }}</th>
          <th>{{ $t("Copper") }}</th>
          <th>{{ $t("Uranium") }}</th>
          <th>{{ $t("Needs") }}</th>
          <th>{{ $t("Enhancing") }}</th>
          <th
            v-if="
              $store.state.game.loginUser !== null &&
                $store.state.game.loginUser === $store.state.game.user
            "
          >
            {{ $t("Enhance") }}
          </th>
          <th>{{ $t(" ") }}</th>
        </thead>
        <tbody>
          <tr v-for="skill in skills" :key="skill.name">
            <td>{{ $t(skill.name) }}</td>
            <td>{{ skill.current }}</td>
            <td>{{ skill.coal }}</td>
            <td>{{ skill.ore }}</td>
            <td>{{ skill.copper }}</td>
            <td>{{ skill.uranium }}</td>
            <td>
              {{ skill.time | timePretty }}
            </td>
            <td>{{ skill.busy | busyPretty }}</td>
            <td
              v-if="
                $store.state.game.loginUser !== null &&
                  $store.state.game.loginUser === $store.state.game.user
              "
            >
              <button
                :disabled="clicked.includes(skill.name)"
                v-if="skillPossible(skill)"
                @click="enhanceSkill(skill)"
              >
                ↑
              </button>
            </td>
            <td v-if="chainResponse.includes(skill.name)">
              {{ $t("⌛") }}
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

export default {
  name: "skills",
  props: ["user"],
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
      await this.getSkills();
      await this.getQuantity();
    },
    async getSkills() {
      const response = await SkillsService.all(this.user);
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
      SteemConnectService.setAccessToken(this.$store.state.game.accessToken);
      SteemConnectService.enhanceSkill(
        this.$store.state.game.loginUser,
        this.$store.state.planet.id,
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

<template>
  <div class="missions">
    <h1>{{ $t("Missions") }}</h1>
    <template v-if="routeUser !== gameUser">
      <p>
        {{ $t("User: ") + routeUser }}
      </p>
    </template>
    <template v-if="routeUser !== 'null'">
      <table class="mission">
        <thead>
          <th @click="sortActive('id')">{{ $t("Active Mission") }}</th>
          <th @click="sortActive('type')">{{ $t("Type") }}</th>
          <th @click="sortActive('start_x')">{{ $t("Origin") }}</th>
          <th @click="sortActive('end_x')">{{ $t("Destination") }}</th>
          <th @click="sortActive('arrival')">{{ $t("Arrival") }}</th>
          <th @click="sortActive('return')">{{ $t("Return") }}</th>
          <th>{{ $t("Result") }}</th>
        </thead>
        <tbody>
          <tr v-for="mission in sortedActiveMissions" :key="mission.id">
            <td>{{ mission.id }}</td>
            <td>{{ mission.type }}</td>
            <td>{{ "(" + mission.start_x + "/" + mission.start_y + ")" }}</td>
            <td>{{ "(" + mission.end_x + "/" + mission.end_y + ")" }}</td>
            <td>{{ moment.unix(mission.arrival, "seconds").format("LLL") }}</td>
            <td>{{ moment.unix(mission.return, "seconds").format("LLL") }}</td>
            <td>{{ $t(mission.result || "-") }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="JSON.stringify(activeMissions) === '[]'">
        {{ $t("No Result") }}
      </p>
      <br />
      <table class="mission">
        <thead>
          <th @click="sortOld('id')">{{ $t("Finished Mission") }}</th>
          <th @click="sortOld('type')">{{ $t("Type") }}</th>
          <th @click="sortOld('start_x')">{{ $t("Origin") }}</th>
          <th @click="sortOld('end_x')">{{ $t("Destination") }}</th>
          <th @click="sortOld('arrival')">{{ $t("Arrival") }}</th>
          <th @click="sortOld('return')">{{ $t("Return") }}</th>
          <th>{{ $t("Result") }}</th>
        </thead>
        <tbody>
          <tr v-for="mission in sortedOldMissions" :key="mission.id">
            <td>{{ mission.id }}</td>
            <td>{{ mission.type }}</td>
            <td>{{ "(" + mission.start_x + "/" + mission.start_y + ")" }}</td>
            <td>{{ "(" + mission.end_x + "/" + mission.end_y + ")" }}</td>
            <td>{{ moment.unix(mission.arrival, "seconds").format("LLL") }}</td>
            <td>{{ moment.unix(mission.return, "seconds").format("LLL") }}</td>
            <td>{{ $t(mission.result || "-") }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="JSON.stringify(oldMissions) === '[]'">
        {{ $t("No Result") }}
      </p>
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
import MissionsService from "@/services/missions";
import { mapState } from "vuex";

export default {
  name: "missions",
  props: ["routeUser"],
  data: function() {
    return {
      missions: null,
      activeMissions: null,
      oldMissions: null,
      currentActiveSort: "arrival",
      currentActiveSortDir: "asc",
      currentOldSort: "return",
      currentOldSortDir: "asc"
    };
  },
  async mounted() {
    await this.prepareComponent();
  },
  computed: {
    ...mapState({
      loginUser: state => state.game.loginUser,
      accessToken: state => state.game.accessToken,
      gameUser: state => state.game.user,
      planetId: state => state.planet.id
    }),
    sortedActiveMissions() {
      var sortedActiveMissions = this.activeMissions;
      if (sortedActiveMissions !== null) {
        return sortedActiveMissions.sort((a, b) => {
          let modifier = 1;
          if (this.currentActiveSortDir === "desc") modifier = -1;
          if (a[this.currentActiveSort] < b[this.currentActiveSort])
            return -1 * modifier;
          if (a[this.currentActiveSort] > b[this.currentActiveSort])
            return 1 * modifier;
          return 0;
        });
      } else {
        return sortedActiveMissions;
      }
    },
    sortedOldMissions() {
      var sortedOldMissions = this.oldMissions;
      if (sortedOldMissions !== null) {
        return sortedOldMissions.sort((a, b) => {
          let modifier = 1;
          if (this.currentOldSortDir === "desc") modifier = -1;
          if (a[this.currentOldSort] < b[this.currentOldSort])
            return -1 * modifier;
          if (a[this.currentOldSort] > b[this.currentOldSort])
            return 1 * modifier;
          return 0;
        });
      } else {
        return sortedOldMissions;
      }
    }
  },
  methods: {
    async prepareComponent() {
      await this.getMissions();
    },
    async getMissions() {
      const response = await MissionsService.all(this.routeUser);
      this.missions = response;
      this.activeMissions = response.new;
      this.oldMissions = response.old;
    },
    sortActive(s) {
      //if s == current sort, reverse
      if (s === this.currentActiveSort) {
        this.currentActiveSortDir =
          this.currentActiveSortDir === "asc" ? "desc" : "asc";
      }
      this.currentActiveSort = s;
    },
    sortOld(s) {
      //if s == current sort, reverse
      if (s === this.currentOldSort) {
        this.currentOldSortDir =
          this.currentOldSortDir === "asc" ? "desc" : "asc";
      }
      this.currentOldSort = s;
    }
  }
};
</script>

<style>
table.mission,
.mission th,
.mission td {
  border-collapse: collapse;
  border: 1px solid dimgrey;
  padding: 5px;
}
</style>

<template>
  <div class="missions">
    <h1>{{ $t("Missions") }}</h1>
    <template v-if="routeUser !== gameUser">
      <p>{{ $t("User: ") + routeUser }}</p>
    </template>
    <template v-if="routeUser !== 'null'">
      <table>
        <thead>
          <th @click="sort('type')">{{ $t("Type") }}</th>
          <th @click="sort('start_x')">{{ $t("Origin") }}</th>
          <th @click="sort('end_x')">{{ $t("Destination") }}</th>
          <th @click="sort('arrival')">{{ $t("Arrival") }}</th>
          <th @click="sort('return')">{{ $t("Return") }}</th>
          <th @click="sort('result')">{{ $t("Result") }}</th>
          <th @click="sort('cancel_trx')">{{ $t("Cancelled") }}</th>
        </thead>
        <tbody>
          <tr v-for="mission in sortedMissions" :key="mission.id">
            <td>{{ $t(mission.type) }}</td>
            <td>{{ "(" + mission.start_x + "/" + mission.start_y + ")" }}</td>
            <td>{{ "(" + mission.end_x + "/" + mission.end_y + ")" }}</td>
            <td>{{ moment.unix(mission.arrival, "seconds").format("LLL") }}</td>
            <td>
              <span v-if="mission.return !== null">
                {{ moment.unix(mission.return, "seconds").format("LLL") }}
              </span>
              <span v-else>{{ $t("-") }}</span>
            </td>
            <td>{{ $t(mission.result || "-") }}</td>
            <td>{{ mission.cancel_trx !== null ? "-" : "+" }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="JSON.stringify(missions) === '[]'">{{ $t("No Result") }}</p>
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
      currentSort: "arrival",
      currentDir: "desc"
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
    sortedMissions() {
      var sortedMissions = this.missions;
      if (sortedMissions !== null) {
        return sortedMissions.sort((a, b) => {
          let modifier = 1;
          if (this.currentDir === "desc") modifier = -1;
          if (a[this.currentSort] === null) return -1 * modifier;
          if (b[this.currentSort] === null) return 1 * modifier;
          if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
          if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          return 0;
        });
      } else {
        return sortedMissions;
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
    },
    sort(s) {
      //if s == current sort, reverse
      if (s === this.currentSort) {
        this.currentDir = this.currentDir === "asc" ? "desc" : "asc";
      }
      this.currentSort = s;
    }
  }
};
</script>

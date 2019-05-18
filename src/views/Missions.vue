<template>
  <div class="missions">
    <h1>{{ $t("Missions") }}</h1>
    <template v-if="user !== this.$store.state.game.user">
      <p>
        {{ $t("User: ") + user }}
      </p>
    </template>
    <template v-if="user !== 'null'">
      <table class="mission">
        <thead>
          <th>{{ $t("Active Mission") }}</th>
          <th>{{ $t("Type") }}</th>
          <th>{{ $t("Origin") }}</th>
          <th>{{ $t("Destination") }}</th>
          <th>{{ $t("Arrival") }}</th>
          <th>{{ $t("Return") }}</th>
          <th>{{ $t("Result") }}</th>
        </thead>
        <tbody>
          <tr v-for="mission in activeMissions" :key="mission.id">
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
          <th>{{ $t("Finished Mission") }}</th>
          <th>{{ $t("Type") }}</th>
          <th>{{ $t("Origin") }}</th>
          <th>{{ $t("Destination") }}</th>
          <th>{{ $t("Arrival") }}</th>
          <th>{{ $t("Return") }}</th>
          <th>{{ $t("Result") }}</th>
        </thead>
        <tbody>
          <tr v-for="mission in oldMissions" :key="mission.id">
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

export default {
  name: "missions",
  props: ["user"],
  data: function() {
    return {
      missions: null,
      activeMissions: null,
      oldMissions: null
    };
  },
  async mounted() {
    await this.prepareComponent();
  },
  methods: {
    async prepareComponent() {
      await this.getMissions();
    },
    async getMissions() {
      const response = await MissionsService.all(this.user);
      this.missions = response;
      this.activeMissions = response.new;
      this.oldMissions = response.old;
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

<template>
  <div class="activity">
    <h1>{{ $t("Activity") }}</h1>
    <table>
      <thead>
        <th>{{ $t("Date") }}</th>
        <th>{{ $t("User") }}</th>
        <th>{{ $t("Transaction") }}</th>
        <th>{{ $t("Details") }}</th>
      </thead>
      <tbody>
        <tr v-for="transaction in activity" :key="transaction.trx">
          <td>{{ moment.unix(transaction.date, "seconds").format("lll") }}</td>
          <td @click="setUser(rank.user)">{{ transaction.user }}</td>
          <td>{{ transaction.tr_type }}</td>
          <td>{{ transaction.trx }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ActivityService from "@/services/activity";
import UserService from "@/services/user";
import PlanetsService from "@/services/planets";
import moment from "moment";

export default {
  name: "ranking",
  data: function() {
    return {
      activity: null
    };
  },
  async mounted() {
    await this.prepareComponent();
  },
  methods: {
    async prepareComponent() {
      await this.getActivity();
    },
    async getActivity() {
      const response = await ActivityService.all(100);
      this.activity = response;
    },
    setUser(newUser) {
      this.fetchUser(newUser).then(searchedUser => {
        if (searchedUser !== null && searchedUser === newUser) {
          this.$store.dispatch("game/setUser", newUser);
          this.fetchStarterPlanet(newUser).then(planet => {
            this.$store.dispatch("planet/setId", planet.id);
            this.$store.dispatch("planet/setName", planet.name);
            this.$store.dispatch("planet/setPosX", planet.posx);
            this.$store.dispatch("planet/setPosY", planet.posy);
          });
        } else {
          this.placeholder = "not found";
          this.user = null;
        }
      });
    },
    async fetchUser(user) {
      const response = await UserService.get(user);
      return response.username;
    },
    async fetchStarterPlanet(user) {
      const response = await PlanetsService.starterPlanet(user);
      return response;
    }
  }
};
</script>

<style>
.activity .material-design-icon > .material-design-icon__svg {
  height: 1.5em;
  width: 1.5em;
}
</style>

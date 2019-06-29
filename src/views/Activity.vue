<template>
  <div class="activity">
    <h1>{{ $t("Activity") }}</h1>
    <P
      ><i>{{
        $t("Click users to view the game from their perspective.")
      }}</i></P
    >
    <p>
      <select @change="onSelect(activityType)" v-model="activityType">
        <option value="all">{{ $t("All") }}</option>
        <option value="explorespace">{{ $t("explorespace") }}</option>
        <option value="transport">{{ $t("transport") }}</option>
        <option value="deploy">{{ $t("deploy") }}</option>
        <option value="support">{{ $t("support") }}</option>
        <option value="attack">{{ $t("attack") }}</option>
        <option value="siege">{{ $t("siege") }}</option>
        <option value="buildship">{{ $t("buildship") }}</option>
        <option value="upgrade">{{ $t("upgrade") }}</option>
        <option value="enhance">{{ $t("enhance") }}</option>
        <option value="transport">{{ $t("transport") }}</option>
        <option value="activate">{{ $t("activate") }}</option>
        <option value="giftitem">{{ $t("giftitem") }}</option>
        <option value="giftplanet">{{ $t("giftplanet") }}</option>
        <option value="renameplanet">{{ $t("renameplanet") }}</option>
        <option value="cancel">{{ $t("cancel") }}</option>
        <option value="enable">{{ $t("enable") }}</option>
        <option value="charge">{{ $t("charge") }}</option>
        <option value="newuser">{{ $t("newuser") }}</option>
      </select>
    </p>
    <table>
      <thead>
        <th>{{ $t("Date") }}</th>
        <th>{{ $t("User") }}</th>
        <th>{{ $t("Transaction") }}</th>
        <th>{{ $t("ID") }}</th>
      </thead>
      <tbody>
        <tr v-for="transaction in activity" :key="transaction.trx">
          <td>{{ moment.unix(transaction.date, "seconds").format("lll") }}</td>
          <td @click="setUser(transaction.user)">{{ transaction.user }}</td>
          <td>{{ $t(transaction.tr_type) }}</td>
          <td>
            <a :href="baseUrl() + '/loadtransaction?trx_id=' + transaction.trx"
              >{{ transaction.trx.substring(0, 8) }}...</a
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ActivityService from "@/services/activity";
import UserService from "@/services/user";
import PlanetsService from "@/services/planets";

export default {
  name: "activity",
  data: function() {
    return {
      activity: null,
      activityType: "all"
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
    async getActivityByType(activityType) {
      const response = await ActivityService.byType(activityType);
      this.activity = response;
    },
    baseUrl() {
      return process.env.VUE_APP_ROOT_API;
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
    },
    async onSelect(activityType) {
      if (activityType === "all") {
        await this.getActivity();
      } else {
        await this.getActivityByType(activityType);
      }
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

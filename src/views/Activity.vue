<template>
  <div class="activity">
    <h1>{{ $t("Activity") }}</h1>

    <p>
      <input
        v-model="userFilter"
        @blur="setUserFilter(userFilter)"
        @keyup.enter="setUserFilter(userFilter)"
        :placeholder="placeholder"
      />
      &nbsp;
      <select @change="setActivityType(activityType)" v-model="activityType">
        <option value="all">{{ $t("All Commands") }}</option>
        <option value="explorespace">{{ $t("explorespace") }}</option>
        <option value="transport">{{ $t("transport") }}</option>
        <option value="deploy">{{ $t("deploy") }}</option>
        <option value="support">{{ $t("support") }}</option>
        <option value="attack">{{ $t("attack") }}</option>
        <option value="siege">{{ $t("siege") }}</option>
        <option value="breaksiege">{{ $t("breaksiege") }}</option>
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
        <option value="transferstardust">{{ $t("transferstardust") }}</option>
        <option value="issue">{{ $t("issue") }}</option>
        <option value="issuestardust">{{ $t("Issue Stardust") }}</option>
        <option value="newseason">{{ $t("newseason") }}</option>
        <option value="upgradeyamato">{{ $t("upgradeyamato") }}</option>
        <option value="ask">{{ $t("ask") }}</option>
        <option value="cancel_ask">{{ $t("cancel_ask") }}</option>
        <option value="fill_ask">{{ $t("fill_ask") }}</option>
      </select>
      &nbsp;
      <button @click="setUserFilter(gameUser)">{{ $t("Me") }}</button>
      &nbsp;
      <button @click="setUserFilter(null)">{{ $t("All") }}</button>
    </p>

    <table>
      <thead>
        <th>{{ $t("Date") }}</th>
        <th>{{ $t("User") }}</th>
        <th>{{ $t("Command") }}</th>
        <th>{{ $t("Status") }}</th>
        <th>{{ $t("Transaction") }}</th>
      </thead>
      <tbody>
        <tr v-for="transaction in activity" :key="transaction.trx">
          <td>
            {{ moment.unix(transaction.date, "seconds").format("MMM D HH:mm") }}
          </td>
          <td @click="setUserFilter(transaction.user)">
            {{ transaction.user }}
          </td>
          <td @click="setActivityType(transaction.tr_type)">
            {{ $t(transaction.tr_type) }}
          </td>
          <td>
            <span
              :style="{ color: transaction.tr_status == 2 ? 'red' : 'white' }"
              >{{ prettyStatus(transaction.tr_status) }}</span
            >
          </td>
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
import { mapState } from "vuex";

export default {
  name: "activity",
  data: function() {
    return {
      activity: null,
      activityType: "all",
      userFilter: null,
      placeholder: "Filter User"
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
      planetId: state => state.planet.id,
      planetName: state => state.planet.name
    })
  },
  methods: {
    async prepareComponent() {
      if (this.$route.name == "activity") {
        this.userFilter = this.gameUser;
        await this.getActivityByFilter(this.activityType, this.userFilter);
      }
    },
    async getActivity() {
      const response = await ActivityService.all(100);
      this.activity = response;
    },
    async getActivityByFilter(activityType = null, userFilter = null) {
      if (activityType === "all") {
        const response = await ActivityService.byFilter(null, userFilter);
        this.activity = response;
      } else {
        const response = await ActivityService.byFilter(
          activityType,
          userFilter
        );
        this.activity = response;
      }
    },
    baseUrl() {
      return process.env.VUE_APP_ROOT_API;
    },
    async setActivityType(activityType) {
      this.activityType = activityType;
      await this.getActivityByFilter(this.activityType, this.userFilter);
    },
    async setUserFilter(userFilter) {
      if (userFilter !== "") {
        this.userFilter = userFilter;
      } else {
        this.userFilter = null;
      }
      await this.getActivityByFilter(this.activityType, this.userFilter);
    },

    prettyStatus(transactionStatus) {
      if (transactionStatus === 0) {
        return "Unprocessed";
      }
      if (transactionStatus === 1) {
        return "Success";
      }
      if (transactionStatus === 2) {
        return "Failed";
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

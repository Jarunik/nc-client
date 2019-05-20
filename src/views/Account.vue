<template>
  <div>
    <div>
      <h1>
        <b>Next</b>Colony
      </h1>
    </div>
    <p>{{ $t("Explore. Colonize. Battle. Collect.") }}</p>
    <p>
      {{ $t("Explore undiscovered space") }}
      <br>
      {{ $t("Find and colonize new planets") }}
      <br>
      {{ $t("Battle for honor and resources") }}
      <br>
      {{ $t("Trade digital collectibles") }}
    </p>
    <p>
      <i>
        {{
        $t(
        "Warning: This is alternative, experimental client and in development."
        )
        }}
      </i>
      <br>
      <i>
        {{
        $t(
        "Please use the offical client if you don't want to test an alpha version."
        )
        }}
      </i>
    </p>

    <p>
      <a href="https://nextcolony.io">{{ $t("Official NextColony Client") }}</a>
    </p>
    <template v-if="!loginUser">
      <img src="@/assets/nextcolony-icon.png" width="90px" height="90px">
      <p>
        <i>{{ $t("Secure 1-click-registration via SteemConnect:") }}</i>
      </p>
      <button v-on:click="login">{{ $t("Login") }}</button>
    </template>
    <template v-else>
      <p>---</p>
      <p>{{ $t("Logged in as") }}: {{ loginUser }}</p>
      <p>{{ $t("Valid Access Token") }}: {{ accessToken !== null }}</p>
      <p>
        {{ $t("Valid until") }}:
        {{
        moment
        .utc(expiryDate)
        .local()
        .format("LLL")
        }}
      </p>
      <p>
        <button v-on:click="logout">{{ $t("Logout") }}</button>
      </p>
    </template>
  </div>
</template>

<script>
import PlanetsService from "@/services/planets";
import SteemConnectService from "@/services/steemconnect";
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "overview",
  props: ["callbackUserName", "callbackAccessTokken", "callbackExpiresIn"],
  data: function() {
    return {
      loginURL: null,
      planetSearch: null
    };
  },
  computed: {
    ...mapState({
      loginUser: state => state.game.loginUser,
      accessToken: state => state.game.accessToken,
      expiresIn: state => state.game.expiresIn,
      expiryDate: state => JSON.parse(state.game.expiryDate)
    })
  },
  methods: {
    login() {
      this.loginURL = SteemConnectService.getLoginURL();
      window.location.href = this.loginURL;
    },
    logout() {
      this.$store.dispatch("game/setLoginUser", null);
      this.$store.dispatch("game/setAccessToken", null);
      this.$store.dispatch("game/setExpiresIn", null);
      this.$store.dispatch("game/setExpiryDate", null);
      // Reset Defaults
      this.$store.dispatch("game/setUser", null);
      this.$store.dispatch("planet/setId", null);
      this.$store.dispatch("planet/setName", null);
      window.location.href = "/";
    },
    async fetchUser(user) {
      const response = await UserService.get(user);
      return response.username;
    },
    async fetchStarterPlanet(user) {
      const response = await PlanetsService.starterPlanet(user);
      return response.planets[0];
    }
  },
  created() {
    // Set new Login Information from props in the store
    if (this.callbackUserName) {
      this.$store.dispatch("game/setLoginUser", this.callbackUserName);
      this.$store.dispatch("game/setAccessToken", this.callbackAccessToken);
      this.$store.dispatch("game/setExpiresIn", this.callbackExpiresIn);
      var duration = moment.duration(
        parseInt(this.callbackExpiresIn),
        "seconds"
      );
      var expiryDate = JSON.stringify(moment.utc().add(duration));
      this.$store.dispatch("game/setExpiryDate", expiryDate);
      // Fill Defaults
      this.fetchUser(this.callbackUserName).then(searchedUser => {
        if (searchedUser !== null) {
          this.$store.dispatch("game/setUser", this.searchedUser);
          this.fetchStarterPlanet(this.callbackUserName).then(() => {
            this.$store.dispatch("planet/setId", this.planetSearch.id);
            this.$store.dispatch("planet/setName", this.planetSearch.name);
          });
        } else {
          this.$store.dispatch("game/setUser", null);
          this.$store.dispatch("planet/setId", null);
          this.$store.dispatch("planet/setName", null);
        }
      });
    }
  }
};
</script>

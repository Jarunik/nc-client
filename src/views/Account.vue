<template>
  <div>
    <div>
      <h1><b>Next</b>Colony</h1>
    </div>
    <p>{{ $t("Explore. Colonize. Battle. Collect.") }}</p>
    <p>
      {{ $t("Explore undiscovered space") }}
      <br />
      {{ $t("Find and colonize new planets") }}
      <br />
      {{ $t("Battle for honor and resources") }}
      <br />
      {{ $t("Trade digital collectibles") }}
    </p>
    <p>
      <i
        >{{
          $t(
            "Warning: This is alternative, experimental client and in development."
          )
        }}
      </i>
      <br />
      <i>
        {{
          $t(
            "Please use the offical client if you don't want to test an alpha version."
          )
        }}</i
      >
    </p>

    <p>
      <a href="https://nextcolony.io">
        {{ $t("Official NextColony Client") }}</a
      >
    </p>
    <template v-if="!gameLoginUser">
      <img src="@/assets/nextcolony-icon.png" width="90px" height="90px" />
      <p>
        <i>{{ $t("Secure 1-click-registration via SteemConnect:") }}</i>
      </p>
      <button v-on:click="login">{{ $t("Login") }}</button>
    </template>
    <template v-else>
      <p>---</p>
      <p>{{ $t("Logged in as") }}: {{ gameLoginUser }}</p>
      <p>{{ $t("Valid Access Token") }}: {{ gameAccessToken !== null }}</p>
      <p>
        {{ $t("Valid until") }}:
        {{
          moment
            .utc(gameExpiryDate)
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

export default {
  name: "overview",
  props: ["loginUserName", "loginAccessToken", "loginExpiresIn"],
  data: function() {
    return {
      loginURL: null,
      planetSearch: null
    };
  },
  computed: {
    gameLoginUser: {
      get() {
        return this.$store.state.game.loginUser;
      }
    },
    gameAccessToken: {
      get() {
        return this.$store.state.game.accessToken;
      }
    },
    gameExpiresIn: {
      get() {
        return this.$store.state.game.expiresIn;
      }
    },
    gameExpiryDate: {
      get() {
        return JSON.parse(this.$store.state.game.expiryDate);
      }
    }
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
    async getStarterPlanet(user) {
      const response = await PlanetsService.starterPlanet(user);
      this.planetSearch = response.planets[0];
    }
  },
  created() {
    // Set new Login Information from props in the store
    if (this.loginUserName) {
      this.$store.dispatch("game/setLoginUser", this.loginUserName);
      this.$store.dispatch("game/setAccessToken", this.loginAccessToken);
      this.$store.dispatch("game/setExpiresIn", this.loginExpiresIn);
      var duration = moment.duration(parseInt(this.loginExpiresIn), "seconds");
      var expiryDate = JSON.stringify(moment.utc().add(duration));
      this.$store.dispatch("game/setExpiryDate", expiryDate);
      // Fill Defaults
      this.$store.dispatch("game/setUser", this.loginUserName);
      this.getStarterPlanet(this.loginUserName).then(() => {
        this.$store.dispatch("planet/setId", this.planetSearch.id);
        this.$store.dispatch("planet/setName", this.planetSearch.name);
      });
    }
  }
};
</script>

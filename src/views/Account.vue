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
      <i>
        {{
          $t(
            "Warning: This is alternative, experimental client which is in development."
          )
        }}
      </i>
      <br />
    </p>
    <p>
      <a href="https://github.com/Jarunik/nc-client">{{
        $t("Source Code on Github")
      }}</a>
    </p>
    {{
      $t(
        "Please use the official client if you don't want to play with the open source version."
      )
    }}
    <p>
      <a href="https://nextcolony.io">{{ $t("Official NextColony Client") }}</a>
    </p>

    <template v-if="!loginUser">
      <img src="@/assets/nextcolony-icon.png" width="90px" height="90px" />
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
      <div v-if="showRegistration">
        <button
          :disabled="registrationClicked"
          v-on:click="register(loginUser)"
        >
          {{ $t("Generate Starter Planet") }}
        </button>
        <div v-if="registrationSuccess">
          <p>{{ $t("Generating Planet ...") }}</p>
          <p>
            {{ $t("Give it some time and then refresh the page with F5.") }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import PlanetsService from "@/services/planets";
import SteemConnectService from "@/services/steemconnect";
import UserService from "@/services/user";
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "overview",
  props: ["callbackUserName", "callbackAccessTokken", "callbackExpiresIn"],
  data: function() {
    return {
      loginURL: null,
      showRegistration: false,
      registrationClicked: false,
      registrationSuccess: false
    };
  },
  computed: {
    ...mapState({
      loginUser: state => state.game.loginUser,
      accessToken: state => state.game.accessToken,
      expiresIn: state => state.game.expiresIn,
      expiryDate: state => JSON.parse(state.game.expiryDate),
      gameUser: state => state.game.user
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
      this.$store.dispatch("planet/setPosX", null);
      this.$store.dispatch("planet/setPosY", null);
      window.location.href = "/";
    },
    async fetchUser(user) {
      const response = await UserService.get(user);
      return response.username;
    },
    async fetchStarterPlanet(user) {
      const response = await PlanetsService.starterPlanet(user);
      return response.planets[0];
    },
    register(user) {
      this.registrationClicked = true;
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.newUser(user, (error, result) => {
        if (error === null && result.success) {
          this.registrationSuccess = true;
        }
      });
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
        if (searchedUser) {
          this.$store.dispatch("game/setUser", searchedUser);
          this.fetchStarterPlanet(this.callbackUserName).then(
            searchedPlanet => {
              if (searchedPlanet) {
                this.$store.dispatch("planet/setId", searchedPlanet.id);
                this.$store.dispatch("planet/setName", searchedPlanet.name);
                this.$store.dispatch("planet/setPosX", searchedPlanet.posx);
                this.$store.dispatch("planet/setPosY", searchedPlanet.posy);
              } else {
                this.$store.dispatch("planet/setId", null);
                this.$store.dispatch("planet/setName", null);
                this.$store.dispatch("planet/setPosX", null);
                this.$store.dispatch("planet/setPosY", null);
              }
            }
          );
        } else {
          this.$store.dispatch("game/setUser", null);
          this.$store.dispatch("planet/setId", null);
          this.$store.dispatch("planet/setName", null);
          this.$store.dispatch("planet/setPosX", null);
          this.$store.dispatch("planet/setPosY", null);
          this.showRegistration = true;
        }
      });
    }
  }
};
</script>

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
    </p>
    <p>
      <a href="https://github.com/Jarunik/nc-client">{{
        $t("Source Code on Github")
      }}</a>
    </p>
    <p>
      {{
        $t(
          "Please use the official client if you don't want to play with the open source version."
        )
      }}
    </p>
    <p>
      <a href="https://nextcolony.io">{{ $t("Official NextColony Client") }}</a>
    </p>
    <p>---</p>
    <span v-if="apiState !== null">
      <table>
        <tr>
          <td>{{ $t("Latest Block Number") }}:</td>
          <td>{{ apiState.latest_block_num }}</td>
        </tr>
        <tr>
          <td>{{ $t("Tracker Delay") }}:</td>
          <td>{{ apiState.tracker_delay_seconds }}</td>
        </tr>
        <tr>
          <td>{{ $t("Tracker Block Number") }}:</td>
          <td>{{ apiState.tracker_block_num }}</td>
        </tr>
        <tr>
          <td>{{ $t("Processing Delay") }}:</td>
          <td>{{ apiState.processing_delay_seconds }}</td>
        </tr>
        <tr>
          <td>{{ $t("Processor Block Number") }}:</td>
          <td>{{ apiState.first_unprocessed_block_num }}</td>
        </tr>
      </table>
    </span>
    <template v-if="!loginUser">
      <img src="@/assets/nextcolony-icon.png" width="90px" height="90px" />
      <p>
        <i>{{ $t("Secure 1-click-registration via SteemConnect") }}</i>
      </p>
      <p>
        <button v-on:click="login">{{ $t("Login with Steemconnect") }}</button>
      </p>
      <p>
        <input v-model="userName" :placeholder="placeholder" />
        <button v-on:click="loginKeychain(userName)">
          {{ $t("Login with Keychain") }}
        </button>
      </p>
    </template>
    <template v-else>
      <p>---</p>
      <p>{{ $t("Logged in as") }}: {{ loginUser }}</p>
      <p>
        {{ $t("Language") }}:
        <select v-model="gameLanguage">
          <option value="en">{{ $t("English") }}</option>
          <option value="ko">{{ $t("Korean") }}</option>
          <option value="de">{{ $t("German") }}</option>
          <option value="es">{{ $t("Spanish") }}</option>
        </select>
      </p>
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
import ApiService from "@/services/api";
import SteemConnectService from "@/services/steemconnect";
import UserService from "@/services/user";
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "overview",
  props: ["callbackUserName", "callbackAccessToken", "callbackExpiresIn"],
  data: function() {
    return {
      loginURL: null,
      showRegistration: false,
      registrationClicked: false,
      registrationSuccess: false,
      apiState: null,
      userName: null,
      placeholder: "Enter User Name"
    };
  },
  async mounted() {
    await this.prepareComponent();
  },
  computed: {
    ...mapState({
      loginUser: state => state.game.loginUser,
      accessToken: state => state.game.accessToken,
      expiresIn: state => state.game.expiresIn,
      expiryDate: state => JSON.parse(state.game.expiryDate),
      gameUser: state => state.game.user
    }),
    gameLanguage: {
      get() {
        return this.$store.state.game.language;
      },
      set(language) {
        this.$store.dispatch("game/setLanguage", language);
        this.$i18n.locale = language;

        this.$store.dispatch("game/setLocale", language);
        moment.locale(language);
      }
    }
  },
  methods: {
    login() {
      this.loginURL = SteemConnectService.getLoginURL();
      window.location.href = this.loginURL;
    },
    loginKeychain(userName) {
      let params = {};
      var self = this;
      // The "username" parameter is required prior to log in for "Steem Keychain" users.
      if (SteemConnectService.useSteemKeychain) {
        params = { username: userName };
      }
      SteemConnectService.login(params, function(err, token) {
        if (token) {
          self.$store.dispatch("game/setLoginUser", userName);
          self.$store.dispatch("game/setAccessToken", token);

          // Fill Defaults
          self.fetchUser(userName).then(searchedUser => {
            if (searchedUser) {
              self.$store.dispatch("game/setUser", searchedUser);
              self.fetchStarterPlanet(userName).then(searchedPlanet => {
                if (searchedPlanet) {
                  self.$store.dispatch("planet/setId", searchedPlanet.id);
                  self.$store.dispatch("planet/setName", searchedPlanet.name);
                  self.$store.dispatch("planet/setPosX", searchedPlanet.posx);
                  self.$store.dispatch("planet/setPosY", searchedPlanet.posy);
                } else {
                  self.$store.dispatch("planet/setId", null);
                  self.$store.dispatch("planet/setName", null);
                  self.$store.dispatch("planet/setPosX", null);
                  self.$store.dispatch("planet/setPosY", null);
                }
              });
            } else {
              self.$store.dispatch("game/setUser", null);
              self.$store.dispatch("planet/setId", null);
              self.$store.dispatch("planet/setName", null);
              self.$store.dispatch("planet/setPosX", null);
              self.$store.dispatch("planet/setPosY", null);
              self.showRegistration = true;
            }
          });
        }
      });
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
      return response;
    },
    register(user) {
      this.registrationClicked = true;
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.newUser(user, (error, result) => {
        if (error === null && result.success) {
          this.registrationSuccess = true;
        }
      });
    },
    async prepareComponent() {
      await this.getApiState();
    },
    async getApiState() {
      const response = await ApiService.apiState();
      this.apiState = response;
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

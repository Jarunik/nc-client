<template>
  <div id="app">
    <div id="navtop">
      <router-link to="/ranking">{{ $t("Ranking") }}</router-link> |
      <router-link to="/shop">{{ $t("Shop") }}</router-link> |
      <router-link :to="'/' + userName + '/items'">
        {{ $t("Items") }}
      </router-link>
      |
      <router-link :to="'/' + userName + '/skills'">
        {{ $t("Skills") }}
      </router-link>
      |
      <router-link :to="'/' + userName + '/' + planetId + '/buildings'">
        {{ $t("Buildings") }}
      </router-link>
      |
      <router-link :to="'/' + userName + '/' + planetId + '/shipyard'">
        {{ $t("Shipyard") }}
      </router-link>
      |
      <router-link :to="'/' + userName + '/missions'">
        {{ $t("Missions") }}
      </router-link>
      |

      <router-link to="/user">{{ userName || $t("Set User") }}</router-link> |
      <template v-if="loginUser === null">
        <router-link to="/">{{ $t("Login") }}</router-link>
      </template>
      <template v-else>
        <router-link to="/">{{ "@" }}</router-link>
      </template>
    </div>
    <div id="middle">
      <router-view />
    </div>
    <div id="navbottom">
      <router-link :to="'/' + userName + '/' + planetId + '/production'">
        <QuantityRibbon />
      </router-link>
      <router-link :to="'/' + userName + '/planets'">
        {{ planetName || $t("Set Planet") }}
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import QuantityRibbon from "@/components/QuantityRibbon.vue";

export default {
  name: "App",
  components: {
    QuantityRibbon
  },
  computed: {
    // Needed to set i18n.locale to change language
    ...mapGetters("game", ["language", "locale"]),
    loginUser: {
      get() {
        return this.$store.state.game.loginUser;
      },
      set(value) {
        this.$store.dispatch("game/setLoginUser", value);
      }
    },
    userName: {
      get() {
        return this.$store.state.game.user;
      },
      set(value) {
        this.$store.dispatch("game/setUser", value);
      }
    },
    planetName: {
      get() {
        return this.$store.state.planet.name;
      }
    },
    planetId: {
      get() {
        return this.$store.state.planet.id;
      }
    }
  },
  mounted() {
    // Check token expiry to automaticall logout
    var expiry = moment(
      new Date(JSON.parse(localStorage.getItem("gameExpiryDate")))
    );

    if (
      moment.utc().isAfter(expiry) &&
      this.$store.state.game.loginUser !== null
    ) {
      this.$store.dispatch("game/setLoginUser", null);
      this.$store.dispatch("game/setAccessToken", null);
      this.$store.dispatch("game/setExpiresIn", null);
      this.$store.dispatch("game/setExpiryDate", null);
      // Reset Defaults
      this.$store.dispatch("game/setUser", null);
      this.$store.dispatch("planet/setId", null);
      this.$store.dispatch("planet/setName", null);
      window.location.href = "/";
    }
  },
  created() {
    // Initialize the store from local storage of browser
    var gameUser = localStorage.getItem("gameUser");
    if (gameUser !== "undefined") {
      this.$store.dispatch("game/setUser", JSON.parse(gameUser));
    }

    var gameLoginUser = localStorage.getItem("gameLoginUser");
    if (gameLoginUser !== "undefined") {
      this.$store.dispatch("game/setLoginUser", JSON.parse(gameLoginUser));
    }

    var gameAccessToken = localStorage.getItem("gameAccessToken");
    if (gameAccessToken !== "undefined") {
      this.$store.dispatch("game/setAccessToken", JSON.parse(gameAccessToken));
    }

    var gameExpiresIn = localStorage.getItem("gameExpiresIn");
    if (gameExpiresIn !== "undefined") {
      this.$store.dispatch("game/setExpiresIn", JSON.parse(gameExpiresIn));
    }

    var gameExpiryDate = localStorage.getItem("gameExpiryDate");
    if (gameExpiryDate !== "undefined") {
      this.$store.dispatch("game/setExpiryDate", JSON.parse(gameExpiryDate));
    }

    var planetId = localStorage.getItem("planetId");
    if (planetId !== "undefined") {
      this.$store.dispatch("planet/setId", JSON.parse(planetId));
    }

    var planetName = localStorage.getItem("planetName");
    if (planetName !== "undefined") {
      this.$store.dispatch("planet/setName", JSON.parse(planetName));
    }

    var gameLanguage = localStorage.getItem("gameLanguage");
    if (gameLanguage !== "undefined") {
      this.$store.dispatch(
        "game/setLanguage",
        JSON.parse(gameLanguage) || "en"
      );
    }

    var gameLocale = localStorage.getItem("gameLocale");
    if (gameLocale !== "undefined") {
      this.$store.dispatch(
        "game/setLocale",
        JSON.parse(gameLocale) || navigator.language || "en"
      );
    }

    this.$i18n.locale = this.language;
    moment.locale(this.locale);
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
}
#navtop {
  padding: 15px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #100f1c;
}

#navtop a {
  color: white;
  text-decoration: none;
}

#navtop a.router-link-exact-active {
  color: white;
}

#middle {
  padding-top: 60px;
  padding-bottom: 60px;
}
#navbottom {
  padding: 15px;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #100f1c;
}
#navbottom a {
  color: white;
  text-decoration: none;
}
#navbottom a.router-link-exact-active {
  color: white;
}

body {
  background-image: url("./assets/background.jpg");
  background-repeat: repeat;
}
html {
  margin-left: calc(100vw - 100%);
}
a {
  color: white;
}
table {
  margin-left: auto;
  margin-right: auto;
}
</style>

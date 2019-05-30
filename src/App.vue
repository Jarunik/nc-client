<template>
  <div id="app">
    <div id="navtop">
      <router-link to="/ranking"
        ><chevron-triple-up-icon :title="$t('Ranking')"
      /></router-link>
      | <router-link to="/shop"><cart-icon :title="$t('Shop')"/></router-link> |
      <router-link :to="'/items'">
        <package-variant-closed-icon :title="$t('Items')" />
      </router-link>
      |
      <router-link :to="'/skills'">
        <school-icon :title="$t('Skills')" />
      </router-link>
      |
      <router-link :to="'/buildings'">
        <home-city-icon :title="$t('Buildings')" />
      </router-link>
      |
      <router-link :to="'/shipyard'">
        <factory-icon :title="$t('Shipyard')" />
      </router-link>
      |
      <router-link :to="'/galaxy'">
        <map-icon :title="$t('Galaxy')" />
      </router-link>
      |
      <router-link :to="'/fleet'">
        <ship-wheel-icon :title="$t('Fleet')" />
      </router-link>
      |
      <router-link :to="'/missions'">
        <calendar-icon :title="$t('Mission')" />
      </router-link>
      |
      <router-link :to="'/planets'">
        <earth-icon :title="$t('Planets')" />
      </router-link>
      |
      <router-link to="/user"><account-icon :title="$t('User')"/></router-link>
      |
      <router-link to="/"><login-icon :title="$t('Login')"/></router-link>
    </div>
    <div id="middle">
      <router-view />
    </div>
    <div id="navbottom">
      <PlanetNav :routeUser="gameUser" />
      <br />
      <router-link :to="'/production'">
        <QuantityRibbon />
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import QuantityRibbon from "@/components/QuantityRibbon.vue";
import PlanetNav from "@/components/PlanetNav.vue";
import HomeCityIcon from "vue-material-design-icons/HomeCity.vue";
import SchoolIcon from "vue-material-design-icons/School.vue";
import CartIcon from "vue-material-design-icons/Cart.vue";
import PackageVariantClosedIcon from "vue-material-design-icons/PackageVariantClosed.vue";
import ChevronTripleUpIcon from "vue-material-design-icons/ChevronTripleUp.vue";
import ShipWheelIcon from "vue-material-design-icons/ShipWheel.vue";
import FactoryIcon from "vue-material-design-icons/Factory.vue";
import MapIcon from "vue-material-design-icons/Map.vue";
import CalendarIcon from "vue-material-design-icons/Calendar.vue";
import LoginIcon from "vue-material-design-icons/Login.vue";
import AccountIcon from "vue-material-design-icons/Account.vue";
import EarthIcon from "vue-material-design-icons/Earth.vue";

export default {
  name: "App",
  components: {
    QuantityRibbon,
    PlanetNav,
    HomeCityIcon,
    SchoolIcon,
    CartIcon,
    PackageVariantClosedIcon,
    ChevronTripleUpIcon,
    ShipWheelIcon,
    FactoryIcon,
    MapIcon,
    CalendarIcon,
    LoginIcon,
    AccountIcon,
    EarthIcon
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
    gameUser: {
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
    },
    planetPosX: {
      get() {
        return this.$store.state.planet.posX;
      }
    },
    planetPosY: {
      get() {
        return this.$store.state.planet.posY;
      }
    }
  },
  mounted() {
    // Check token expiry to automaticall logout
    var expiry = moment(
      new Date(JSON.parse(localStorage.getItem("gameExpiryDate")))
    );

    if (moment.utc().isAfter(expiry) && this.loginUser !== null) {
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

    var planetPosX = localStorage.getItem("planetPosX");
    if (planetPosX !== "undefined") {
      this.$store.dispatch("planet/setPosX", JSON.parse(planetPosX));
    }

    var planetPosY = localStorage.getItem("planetPosY");
    if (planetPosY !== "undefined") {
      this.$store.dispatch("planet/setPosY", JSON.parse(planetPosY));
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
  font-size: 150%;
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
  padding-bottom: 120px;
}
#navbottom {
  padding: 10px;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #100f1c;
  font-size: 120%;
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
td {
  padding-left: 4px;
  padding-right: 4px;
}
input {
  width: 15ch;
}
</style>

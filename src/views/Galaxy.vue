<template>
  <div class="galaxy">
    <h1>{{ $t("Galaxy") }}</h1>
    <template v-if="routeUser !== gameUser">
      <p>
        {{ $t("User: ") + routeUser }}
        <template v-if="routeUser !== planetId">
          <br />{{ $t("Planet: ") + routePlanet }}
        </template>
      </p>
    </template>
    <template v-if="this.galaxy != null">
      <table>
        <tbody>
          <tr v-for="y in 13" :key="y">
            <td @click="focus(x, y)" v-for="x in 21" :key="x">
              <span v-if="focusX === coordinateX(x) && focusY == coordinateY(y)"
                ><font color="green">
                  <span v-if="lookupLocation(x, y) === 'space'">&nbsp;</span>
                  <magnify-icon
                    v-if="lookupLocation(x, y) === 'explore'"
                    :title="$t('Exploring')"
                  />
                  <texture-icon
                    v-if="lookupLocation(x, y) === 'fog'"
                    :title="$t('Fog')"
                  />
                  <earth-icon
                    v-if="lookupLocation(x, y) === 'home'"
                    :title="$t('Home')"
                  />
                  <circle-icon
                    v-if="lookupLocation(x, y) === 'planet'"
                  /> </font
              ></span>
              <span v-else>
                <span v-if="lookupLocation(x, y) === 'space'">&nbsp;</span>
                <magnify-icon
                  v-if="lookupLocation(x, y) === 'explore'"
                  :title="$t('Exploring')"
                />
                <texture-icon
                  v-if="lookupLocation(x, y) === 'fog'"
                  :title="$t('Fog')"
                />
                <circle-icon
                  v-if="lookupLocation(x, y) === 'planet'"
                  :title="$t('Planet')"
                />
                <earth-icon
                  v-if="lookupLocation(x, y) === 'home'"
                  :title="$t('Home')"
                />
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <input v-model="search" placeholder="(x/y)" />
      <button @click="goToSearch(search)">
        <target-variant-icon :title="$t('Focus')" />
      </button>
      <button @click="goTo(posX, posY)">
        <earth-icon :title="$t('Home')" />
      </button>
      <button @click="goFleet(focusX, focusY)">
        <ship-wheel-icon :title="$t('Fleet')" />
      </button>
    </template>
  </div>
</template>

<script>
import GalaxyService from "@/services/galaxy";
import { mapState } from "vuex";
import CircleIcon from "vue-material-design-icons/Circle.vue";
import MagnifyIcon from "vue-material-design-icons/Magnify.vue";
import TextureIcon from "vue-material-design-icons/Texture.vue";
import EarthIcon from "vue-material-design-icons/Earth.vue";
import TargetVariantIcon from "vue-material-design-icons/TargetVariant.vue";
import ShipWheelIcon from "vue-material-design-icons/ShipWheel.vue";

export default {
  name: "galaxy",
  components: {
    CircleIcon,
    MagnifyIcon,
    TextureIcon,
    EarthIcon,
    TargetVariantIcon,
    ShipWheelIcon
  },
  props: ["routeUser", "routePlanet"],
  data: function() {
    return {
      galaxy: null,
      focusX: null,
      focusY: null,
      search: null
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
      posX: state => state.planet.posX,
      posY: state => state.planet.posY
    })
  },
  methods: {
    async prepareComponent() {
      await this.getGalaxy();
    },
    async getGalaxy() {
      var xCoordinate = 0;
      var yCoordinate = 0;
      if (this.planetId !== null) {
        xCoordinate = this.posX;
        yCoordinate = this.posY;
        this.focusX = xCoordinate;
        this.focusY = yCoordinate;
        this.search = "(" + this.focusX + "/" + this.focusY + ")";
      }
      if (
        (this.$route.query.x !== undefined && this.$route.query.x !== null) &
        (this.$route.query.y !== undefined && this.$route.query.y !== null)
      ) {
        xCoordinate = this.$route.query.x;
        yCoordinate = this.$route.query.y;
        this.focusX = xCoordinate;
        this.focusY = yCoordinate;
        this.search = "(" + this.focusX + "/" + this.focusY + ")";
      }
      const response = await GalaxyService.galaxy(xCoordinate, yCoordinate);
      this.galaxy = response;
    },
    coordinateX(tableX) {
      return this.galaxy.area.xmin + tableX;
    },
    coordinateY(tableY) {
      return this.galaxy.area.ymax - tableY;
    },
    focus(tableX, tableY) {
      this.focusX = this.coordinateX(tableX);
      this.focusY = this.coordinateY(tableY);
      this.search = "(" + this.focusX + "/" + this.focusY + ")";
    },
    lookupLocation(tableX, tableY) {
      let posX = this.coordinateX(tableX);
      let posY = this.coordinateY(tableY);
      let icon = "fog";

      this.galaxy.explore.forEach(explore => {
        if (explore.x === posX && explore.y === posY) {
          icon = "explore";
        }
      });

      this.galaxy.explored.forEach(explored => {
        if (explored.x === posX && explored.y === posY) {
          icon = "space";
        }
      });

      this.galaxy.planets.forEach(planet => {
        if (planet.x === posX && planet.y === posY) {
          icon = "planet";
        }
      });

      this.galaxy.planets.forEach(planet => {
        if (
          planet.x === posX &&
          planet.y === posY &&
          planet.x === this.posX &&
          planet.y == this.posY
        ) {
          icon = "home";
        }
      });

      return icon;
    },
    goTo(realX, realY) {
      let newPath = this.$route.path;
      this.$router.push({
        path: newPath,
        query: { x: realX, y: realY }
      });
      this.getGalaxy();
    },
    goToSearch(search) {
      let split = search
        .replace("(", "")
        .replace(")", "")
        .replace(/\s+/g, "")
        .split("/");
      this.goTo(split[0], split[1]);
    },
    goFleet(realX, realY) {
      let newPath = this.$route.path.replace("galaxy", "fleet");
      this.$router.push({
        path: newPath,
        query: { x: realX, y: realY }
      });
    }
  }
};
</script>

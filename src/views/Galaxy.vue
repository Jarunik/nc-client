<template>
  <div class="galax">
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
            <td @click="focus(x, y)" v-for="x in 23" :key="x">
              <span v-if="focusX === coordinateX(x) && focusY == coordinateY(y)"
                ><font color="green">{{ lookupLocation(x, y) }}</font></span
              >
              <span v-else>{{ lookupLocation(x, y) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      X: {{ focusX }} Y: {{ focusY }}
    </template>
  </div>
</template>

<script>
import GalaxyService from "@/services/galaxy";
import { mapState } from "vuex";

export default {
  name: "galaxy",
  props: ["routeUser", "routePlanet"],
  data: function() {
    return {
      galaxy: null,
      focusX: null,
      focusY: null
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
    },
    lookupLocation(tableX, tableY) {
      let posX = this.coordinateX(tableX);
      let posY = this.coordinateY(tableY);
      let icon = "x";

      this.galaxy.explore.forEach(explore => {
        if (explore.x === posX && explore.y === posY) {
          icon = "e";
        }
      });

      this.galaxy.explored.forEach(explored => {
        if (explored.x === posX && explored.y === posY) {
          icon = ".";
        }
      });

      //planets
      this.galaxy.planets.forEach(planet => {
        if (planet.x === posX && planet.y === posY) {
          icon = "p";
        }
      });

      return icon;
    }
  }
};
</script>

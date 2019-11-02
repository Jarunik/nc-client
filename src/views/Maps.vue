<template>
  <div class="maps">
    <h1>{{ $t("Maps") }}</h1>
    <p>
      <router-link
        :to="`/galaxy?x=${focusX}&y=${focusY}`"
      >{{ $t("Galaxy") }} {{ focusX }}/{{ focusY }}</router-link>
    </p>
    <div>
      <canvas
        ref="canvas"
        :width="gameSize"
        :height="gameSize"
        @click="focusCoordinate($event)"
        v-on:dblclick="centerCoordinate($event)"
        style="width: 800px; height: 800px;"
      ></canvas>
    </div>
    <button @click="zoomOut()" v-tooltip="$t('Zoom Out')">-</button>
    <button @click="zoomIn()" v-tooltip="$t('Zoom In')">+</button>
    <input :value="search" @blur="updateSearch($event)" placeholder="x/y">
    <button @click="centerSearch(search)" v-tooltip="$t('Center on Selection')">
      <target-variant-icon :title="$t('Focus')"/>
    </button>
    <button @click="centerHome()" v-tooltip="$t('Center on Home')">
      <earth-icon :title="$t('Home')"/>
    </button>
    <button @click="goFleet()" v-tooltip="$t('Send Fleet to Selection')">
      <ship-wheel-icon :title="$t('Fleet')"/>
    </button>
    {{ zoomLevel }}
    <div>
      <br>
      <table v-if="planet !== null">
        <tr>
          <td>{{ planet.id }}</td>
        </tr>
        <tr>
          <td>{{ $t("planet-bonus-" + planet.bonus) }}</td>
        </tr>
        <tr>
          <td>{{ $t("planet-type-" + planet.type) }}</td>
        </tr>
        <tr>
          <td>{{ planet.name }}</td>
        </tr>
        <tr>
          <td>{{ planet.user }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import MapService from "@/services/maps";
import { mapState } from "vuex";
import * as types from "@/store/mutation-types";
import TargetVariantIcon from "vue-material-design-icons/TargetVariant.vue";
import EarthIcon from "vue-material-design-icons/Earth.vue";
import ShipWheelIcon from "vue-material-design-icons/ShipWheel.vue";

const displaySpacing = 10;
const gameGalaxy = 1331;
const displaySize = 800;
const displayPlanetRadius = 4;
const zoomStep = 121;

export default {
  name: "maps",
  components: {
    TargetVariantIcon,
    EarthIcon,
    ShipWheelIcon
  },
  data: function() {
    return {
      planets: null,
      minX: 0,
      maxX: 0,
      width: 0,
      minY: 0,
      maxY: 0,
      height: 0,
      canvas: null,
      ctx: null,
      gameSize: 1331,
      zoomLevel: 0,
      focusX: 0,
      focusY: 0,
      centerX: 0,
      centerY: 0,
      search: null,
      forceFullLoad: false
    };
  },
  async mounted() {
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    await this.prepareComponent();
  },
  computed: {
    ...mapState({
      loginUser: state => state.game.loginUser,
      accessToken: state => state.game.accessToken,
      gameUser: state => state.game.user,
      planetId: state => state.planet.id,
      planetName: state => state.planet.name,
      posX: state => state.planet.posX,
      posY: state => state.planet.posY,
      gameLocale: state => state.game.gameLocale,
      mapsPlanets: state => state.maps.planets,
      lastUpdate: state => state.maps.lastUpdate,
      fullUpdate: state => state.maps.fullUpdate
    }),
    planet() {
      let planet = null;
      if (this.planets != null) {
        planet = this.planets.find(obj => {
          return obj.x == this.focusX && obj.y == this.focusY;
        });
      }
      if (planet == undefined) {
        return null;
      } else {
        return planet;
      }
    }
  },
  methods: {
    async prepareComponent() {
      await this.getMap();
      this.$store.subscribe(mutation => {
        switch (mutation.type) {
          case "planet/" + types.SET_PLANET_ID:
            this.prepareComponent();
        }
      });
      if (
        (this.$route.query.x !== undefined && this.$route.query.x !== null) &
        (this.$route.query.y !== undefined && this.$route.query.y !== null)
      ) {
        this.focusX = parseInt(this.$route.query.x);
        this.focusY = parseInt(this.$route.query.y);
        this.search = this.focusX + "/" + this.focusY;
        this.centerX = this.focusX * displaySpacing;
        this.centerY = this.focusY * displaySpacing;
        this.setZoom(10); // which does this.draw();
      } else {
        this.draw();
      }
    },
    async getMap() {
      let now = this.moment.utc();
      let lastUpdateDate = this.moment(new Date(this.lastUpdate * 1000));
      let planets = null;
      if (this.mapsPlanets != null) {
        planets = this.mapsPlanets.slice(); //slice to make a shallow copy
      }
      let updatedPlanets = null;
      let outdatedFull = now.subtract(7, "days");
      let outdatedDelta = now.subtract(5, "minutes");
      // Full Refresh (initial or after 7 days wihtout update)
      if (
        outdatedFull.isAfter(lastUpdateDate) ||
        outdatedFull.isAfter(this.fullUpdate) ||
        this.lastUpdate == null ||
        this.forceFullLoad ||
        planets == null
      ) {
        const response = await MapService.all();
        planets = response;
        this.$store.dispatch("maps/setFullUpdate", this.moment.utc());
      } else {
        // Delta Load (max every 5 minutes)
        if (outdatedDelta.isAfter(lastUpdateDate)) {
          const response = await MapService.after(this.lastUpdate);
          updatedPlanets = response;
          if (updatedPlanets !== undefined && updatedPlanets.length > 0) {
            updatedPlanets.forEach(newPlanet => {
              let index = planets.findIndex(obj => obj.id == newPlanet.id);
              if (index !== -1) {
                planets[index] = newPlanet;
              } else {
                planets.push(newPlanet);
              }
            });
          }
        }
      }
      if (planets !== null) {
        let lastUpdate = 0;
        planets.forEach(planet => {
          if (planet.update > lastUpdate) {
            lastUpdate = planet.update;
          }
        });
        this.$store.dispatch("maps/setLastUpdate", lastUpdate);
        this.$store.dispatch("maps/setPlanets", planets);
        this.planets = planets;
        this.gameSize = gameGalaxy * displaySpacing;
      }
    },
    drawingX(gameX) {
      return -this.centerX + this.gameSize / 2 + gameX * displaySpacing;
    },
    drawingY(gameY) {
      return this.centerY + this.gameSize / 2 - gameY * displaySpacing;
    },
    draw() {
      this.$nextTick(() => {
        this.clearCanvas();
        if (this.planets !== null) {
          this.ctx.save();
          this.planets.forEach(planet => {
            let x = this.drawingX(planet.x);
            let y = this.drawingY(planet.y);
            let planetSize = displayPlanetRadius;
            if (planet.user == this.gameUser) {
              this.ctx.globalCompositeOperation = "destination-over";
              this.ctx.fillStyle = "#008000"; //yellow
              this.ctx.beginPath();
              this.ctx.arc(x, y, 12 * planetSize, 0, 2 * Math.PI);
              this.ctx.fill();
              this.ctx.globalCompositeOperation = "source-over";
              this.ctx.fillStyle = "#ffff00"; //green
              this.ctx.beginPath();
              this.ctx.arc(x, y, planetSize, 0, 2 * Math.PI);
              this.ctx.fill();
            } else {
              this.ctx.fillStyle = "#FFFFFF"; //white
              this.ctx.beginPath();
              this.ctx.arc(x, y, planetSize, 0, 2 * Math.PI);
              this.ctx.fill();
            }
            if (
              (planet.x == this.centerX && planet.y == this.centerY) ||
              (planet.x == this.focusX && planet.y == this.focusY)
            ) {
              this.ctx.fillStyle = "#ff0000"; //red
              this.ctx.beginPath();
              this.ctx.arc(x, y, planetSize, 0, 2 * Math.PI);
              this.ctx.fill();
            }
          });
          this.ctx.restore();
        }
        // Diagonal Crosshair
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.globalAlpha = 0.2;
        this.ctx.lineWidth = "2";
        this.ctx.strokeStyle = "white";
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.gameSize, this.gameSize);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.strokeStyle = "white";
        this.ctx.moveTo(0, this.gameSize);
        this.ctx.lineTo(this.gameSize, 0);
        this.ctx.stroke();

        // Blue Selector Rectangle
        this.ctx.beginPath();
        this.ctx.globalAlpha = 1;
        this.ctx.lineWidth = "2";
        this.ctx.strokeStyle = "blue";
        this.ctx.rect(
          this.drawingX(this.focusX) - displaySpacing,
          this.drawingY(this.focusY) - displaySpacing,
          2 * displaySpacing,
          2 * displaySpacing
        );
        this.ctx.stroke();
        this.ctx.restore();
      });
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    zoomIn() {
      if (this.zoomLevel == 10) {
        this.zoomLevel = 11;
        this.gameSize =
          gameGalaxy * displaySpacing - (gameGalaxy - 22) * displaySpacing;
      } else {
        this.zoomLevel = Math.min(this.zoomLevel + 1, 10);
        this.gameSize =
          gameGalaxy * displaySpacing -
          this.zoomLevel * zoomStep * displaySpacing;
      }
      this.draw();
    },
    zoomOut() {
      this.zoomLevel = Math.max(this.zoomLevel - 1, 0);
      this.gameSize =
        gameGalaxy * displaySpacing -
        this.zoomLevel * zoomStep * displaySpacing;
      this.draw();
    },
    setZoom(zoomLevel) {
      this.zoomLevel = zoomLevel;
      this.gameSize =
        gameGalaxy * displaySpacing - zoomLevel * zoomStep * displaySpacing;
      this.draw();
    },
    updateSearch(e) {
      this.search = e.target.value;
    },
    centerSearch(search) {
      if (search == null) {
        this.centerX = 0;
        this.centerY = 0;
      } else {
        let split = search.replace(/\s+/g, "").split("/");
        this.centerX = parseInt(split[0] * displaySpacing);
        this.centerY = parseInt(split[1] * displaySpacing);
      }
      this.draw();
    },
    focusCoordinate(event) {
      let rect = this.canvas.getBoundingClientRect();
      let scale = this.gameSize / displaySize / displaySpacing;

      let gameCenterX = this.centerX / displaySpacing;
      let clickedCanvasX = event.clientX - rect.left - displaySize / 2;
      this.focusX = parseInt(gameCenterX + clickedCanvasX * scale);

      let gameCenterY = this.centerY / displaySpacing;
      let clickedCanvasY = -event.clientY + rect.top + displaySize / 2;

      this.focusY = parseInt(gameCenterY + clickedCanvasY * scale);
      this.search = this.focusX + "/" + this.focusY;
      this.draw();
    },
    centerCoordinate(event) {
      this.focusCoordinate(event);
      this.centerSearch(this.search);
    },
    centerHome() {
      this.focusX = this.posX;
      this.focusY = this.posY;
      this.search = this.focusX + "/" + this.focusY;
      this.centerX = this.focusX * displaySpacing;
      this.centerY = this.focusY * displaySpacing;
      this.setZoom(10);
    },
    goFleet() {
      let newPath = this.$route.path.replace("maps", "fleet");
      this.$router.push({
        path: newPath,
        query: { x: this.focusX, y: this.focusY }
      });
    }
  }
};
</script>
<style>
canvas {
  background-color: black;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
}
</style>

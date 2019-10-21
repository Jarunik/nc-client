<template>
  <div class="maps">
    <h1>{{ $t("Maps") }}</h1>
    <p>
      <router-link to="/galaxy">{{ $t("Galaxy") }}</router-link>
    </p>
    <div>
      <canvas
        ref="canvas"
        :width="size"
        :height="size"
        @click="focusCoordinate($event)"
        v-on:dblclick="centerCoordinate($event)"
        style="width: 800px; height: 800px;"
      ></canvas>
    </div>
    <button @click="zoomOut()" v-tooltip="$t('Zoom Out')">
      -
    </button>
    <button @click="zoomIn()" v-tooltip="$t('Zoom In')">
      +
    </button>
    <input :value="search" @blur="updateSearch($event)" placeholder="x/y" />
    <button @click="centerSearch(search)" v-tooltip="$t('Center on Selection')">
      <target-variant-icon :title="$t('Focus')" />
    </button>
    <button @click="centerHome()" v-tooltip="$t('Center on Home')">
      <earth-icon :title="$t('Home')" />
    </button>
    <button @click="goFleet()" v-tooltip="$t('Send Fleet to Selection')">
      <ship-wheel-icon :title="$t('Fleet')" />
    </button>
  </div>
</template>

<script>
import MapService from "@/services/maps";
import { mapState } from "vuex";
import * as types from "@/store/mutation-types";
import TargetVariantIcon from "vue-material-design-icons/TargetVariant.vue";
import EarthIcon from "vue-material-design-icons/Earth.vue";
import ShipWheelIcon from "vue-material-design-icons/ShipWheel.vue";

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
      size: 9000,
      focusX: 0,
      focusY: 0,
      centerX: 0,
      centerY: 0,
      search: null,
      spacing: 6,
      planetSize: 4,
      galaxy: 1400,
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
      lastUpdate: state => state.maps.lastUpdate
    })
  },
  methods: {
    async prepareComponent() {
      await this.getMap();
      this.$store.subscribe(mutation => {
        switch (mutation.type) {
          case "planet/" + types.SET_PLANET_ID:
            this.prepareComponent();
        }
        this.centerHome();
      });
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
        this.lastUpdate == null ||
        this.forceFullLoad ||
        planets == null
      ) {
        const response = await MapService.all();
        planets = response;
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
        let minX = 0;
        let maxX = 0;
        let minY = 0;
        let maxY = 0;
        let lastUpdate = 0;
        planets.forEach(planet => {
          if (planet.x < minX) {
            minX = planet.x * this.spacing;
          }
          if (planet.x > maxX) {
            maxX = planet.x * this.spacing;
          }
          if (planet.y < minY) {
            minY = planet.y * this.spacing;
          }
          if (planet.y > maxY) {
            maxY = planet.y * this.spacing;
          }
          if (planet.update > lastUpdate) {
            lastUpdate = planet.update;
          }
        });
        this.minX = minX;
        this.maxX = maxX;
        this.width = Math.abs(minX) + Math.abs(maxX) + 2;
        this.minY = minY;
        this.maxY = maxY;
        this.height = Math.abs(minY) + Math.abs(maxY) + 2;
        this.$store.dispatch("maps/setLastUpdate", lastUpdate);
        this.$store.dispatch("maps/setPlanets", planets);
        this.planets = planets;
        this.draw();
      }
    },
    draw() {
      this.$nextTick(() => {
        this.clearCanvas();
        if (this.planets !== null) {
          this.planets.forEach(planet => {
            let x = -this.centerX + this.size / 2 + planet.x * this.spacing;
            let y = this.centerY + this.size / 2 - planet.y * this.spacing;
            let planetSize = this.planetSize;
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
          });
        }
      });
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    zoomIn() {
      this.size = this.size - (this.galaxy / 7) * this.spacing;
      if (this.size <= 0) {
        this.size = (this.galaxy / 14) * this.spacing;
      }
      this.draw();
    },
    zoomOut() {
      this.size = this.size + (this.galaxy / 7) * this.spacing;
      if (this.size > ((this.galaxy * 9) / 7) * this.spacing) {
        this.size = ((this.galaxy * 9) / 7) * this.spacing;
      }
      this.draw();
    },
    updateSearch(e) {
      this.search = e.target.value;
    },
    centerSearch(search) {
      let split = search.replace(/\s+/g, "").split("/");
      this.centerX = parseInt(split[0] * this.spacing);
      this.centerY = parseInt(split[1] * this.spacing);
      this.draw();
    },
    focusCoordinate(event) {
      let rect = this.canvas.getBoundingClientRect();
      this.focusX = parseInt(
        this.centerX / this.spacing +
          ((event.clientX - rect.left - 800 / 2) * (this.size / 800)) /
            this.spacing
      );
      this.focusY = parseInt(
        this.centerY / this.spacing +
          ((rect.top - event.clientY + 800 / 2) * (this.size / 800)) /
            this.spacing
      );
      this.search = this.focusX + "/" + this.focusY;
    },
    centerCoordinate(event) {
      this.focusCoordinate(event);
      this.centerSearch(this.search);
    },
    centerHome() {
      this.focusX = this.posX;
      this.focusY = this.posY;
      this.search = this.focusX + "/" + this.focusY;
      this.centerX = this.focusX * this.spacing;
      this.centerY = this.focusY * this.spacing;
      this.draw();
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
}
</style>

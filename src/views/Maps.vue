<template>
  <div class="maps">
    <h1>{{ $t("Maps") }}</h1>
    <div>
      {{ minX }} / {{ minY }} to {{ maxX }} / {{ maxY }} with {{ width }} x
      {{ height }}
    </div>
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
    <input :value="search" @blur="updateSearch($event)" placeholder="x/y" />
    <button @click="centerSearch(search)" v-tooltip="$t('Center on Selection')">
      <target-variant-icon :title="$t('Focus')" />
    </button>
    <button @click="zoomOut()" v-tooltip="$t('Zoom Out')">
      -
    </button>
    <button @click="zoomIn()" v-tooltip="$t('Zoom In')">
      +
    </button>
    {{ size }}
  </div>
</template>

<script>
import MapService from "@/services/maps";
import { mapState } from "vuex";
import * as types from "@/store/mutation-types";
import TargetVariantIcon from "vue-material-design-icons/TargetVariant.vue";

export default {
  name: "maps",
  components: {
    TargetVariantIcon
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
      size: 1400,
      focusX: 0,
      focusY: 0,
      centerX: 0,
      centerY: 0,
      search: null
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
      gameLocale: state => state.game.gameLocale
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
      });
    },
    async getMap() {
      const response = await MapService.all();
      this.planets = response;
      if (this.planets !== undefined && this.planets !== null) {
        let minX = 0;
        let maxX = 0;
        let minY = 0;
        let maxY = 0;
        this.planets.forEach(planet => {
          if (planet.x < minX) {
            minX = planet.x;
          }
          if (planet.x > maxX) {
            maxX = planet.x;
          }
          if (planet.y < minY) {
            minY = planet.y;
          }
          if (planet.y > maxY) {
            maxY = planet.y;
          }
        });
        this.minX = minX;
        this.maxX = maxX;
        this.width = Math.abs(minX) + Math.abs(maxX) + 2;
        this.minY = minY;
        this.maxY = maxY;
        this.height = Math.abs(minY) + Math.abs(maxY) + 2;
        this.draw();
      }
    },
    draw() {
      this.$nextTick(() => {
        this.clearCanvas();
        if (this.planets !== null) {
          this.planets.forEach(planet => {
            let x = -this.centerX + this.size / 2 + planet.x;
            let y = this.centerY + this.size / 2 - planet.y;
            let planetSize = (1 / 800) * (this.size / 2);
            if (planet.user == this.gameUser) {
              this.ctx.fillStyle = "#008000"; //green
              this.ctx.beginPath();
              this.ctx.arc(x, y, 3 * planetSize, 0, 2 * Math.PI);
              this.ctx.fillRect(x, y, 1, 1);
              this.ctx.fill();
            } else {
              this.ctx.fillStyle = "#FFFFFF"; //white
              this.ctx.beginPath();
              this.ctx.arc(x, y, planetSize, 0, 2 * Math.PI);
              this.ctx.fillRect(x, y, 1, 1);
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
      this.size = this.size - 200;
      if (this.size <= 0) {
        this.size = 100;
      }
      this.draw();
    },
    zoomOut() {
      this.size = this.size + 200;
      this.draw();
    },
    updateSearch(e) {
      this.search = e.target.value;
    },
    centerSearch(search) {
      let split = search.replace(/\s+/g, "").split("/");
      this.centerX = parseInt(split[0]);
      this.centerY = parseInt(split[1]);
      this.draw();
    },
    focusCoordinate(event) {
      let rect = this.canvas.getBoundingClientRect();
      this.focusX =
        this.centerX +
        (event.clientX - rect.left - 800 / 2) * (this.size / 800);
      this.focusY =
        this.centerY + (rect.top - event.clientY + 800 / 2) * (this.size / 800);
      this.search = parseInt(this.focusX) + "/" + parseInt(this.focusY);
    },
    centerCoordinate(event) {
      this.focusCoordinate(event);
      this.centerSearch(this.search);
    }
  }
};
</script>
<style>
canvas {
  background-color: black;
}
</style>

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
        style="width: 800px; height: 800px;"
      ></canvas>
    </div>
    <input v-model="size" @blur="draw()" />
  </div>
</template>

<script>
import MapService from "@/services/maps";
import { mapState } from "vuex";
import * as types from "@/store/mutation-types";

export default {
  name: "maps",
  data: function() {
    return {
      planets: null,
      minX: 0,
      maxX: 0,
      width: 0,
      minY: 0,
      maxY: 0,
      height: 0,
      mapTable: null,
      ctx: null,
      size: 1331
    };
  },
  async mounted() {
    this.ctx = this.$refs.canvas.getContext("2d");
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
    }),
    xAxis() {
      let xAxis = [];
      for (var x = this.minX; x <= this.maxX; x++) {
        xAxis.push(x);
      }
      return xAxis;
    },
    yAxis() {
      let yAxis = [];
      for (var y = this.minY; y <= this.minY + 50; y++) {
        yAxis.push(y);
      }
      return yAxis;
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
      this.planets.forEach(planet => {
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(
          planet.x + this.size / 2,
          -planet.y + this.size / 2,
          1,
          1
        );
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

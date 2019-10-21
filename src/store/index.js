import Vue from "vue";
import Vuex from "vuex";
import gameModule from "./modules/game";
import planetModule from "./modules/planet";
import mapsModule from "./modules/maps";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    game: gameModule,
    planet: planetModule,
    maps: mapsModule
  },
  strict: true
});

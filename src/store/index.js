import Vue from "vue";
import Vuex from "vuex";
import gameModule from "./modules/game";
import planetModule from "./modules/planet";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    game: gameModule,
    planet: planetModule
  },
  strict: true
});

import * as types from "../mutation-types";

export default {
  namespaced: true,
  state: {
    planets: null,
    lastUpdate: null,
    fullUpdate: null
  },
  mutations: {
    [types.SET_MAPS_PLANETS](state, payload) {
      state.planets = payload.value;
    },
    [types.SET_MAPS_LASTUPDATE](state, payload) {
      state.lastUpdate = payload.value;
    },
    [types.SET_MAPS_FULLUPDATE](state, payload) {
      state.fullUpdate = payload.value;
    }
  },
  actions: {
    setPlanets: ({ commit }, value) => {
      localStorage.setItem("mapsPlanets", JSON.stringify(value));

      commit({
        type: types.SET_MAPS_PLANETS,
        value
      });
    },
    setLastUpdate: ({ commit }, value) => {
      localStorage.setItem("lastUpdate", JSON.stringify(value));

      commit({
        type: types.SET_MAPS_LASTUPDATE,
        value
      });
    },
    setFullUpdate: ({ commit }, value) => {
      localStorage.setItem("fullUpdate", JSON.stringify(value));

      commit({
        type: types.SET_MAPS_FULLUPDATE,
        value
      });
    }
  },
  getters: {
    planets: state => state.planets,
    lastUpdate: state => state.lastUpdate,
    fullUpdate: state => state.fullUpdate
  }
};

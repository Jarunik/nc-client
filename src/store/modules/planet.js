import * as types from "../mutation-types";

export default {
  namespaced: true,
  state: {
    id: null,
    name: null
  },
  mutations: {
    [types.SET_PLANET_ID](state, payload) {
      state.id = payload.value;
    },
    [types.SET_PLANET_NAME](state, payload) {
      state.name = payload.value;
    }
  },
  actions: {
    setId: ({ commit }, value) => {
      localStorage.setItem("planetId", JSON.stringify(value));
      commit({
        type: types.SET_PLANET_ID,
        value
      });
    },
    setName: ({ commit }, value) => {
      localStorage.setItem("planetName", JSON.stringify(value));
      commit({
        type: types.SET_PLANET_NAME,
        value
      });
    }
  },
  getters: {
    id: state => state.id,
    name: state => state.name
  }
};

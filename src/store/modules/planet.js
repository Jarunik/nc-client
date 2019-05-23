import * as types from "../mutation-types";

export default {
  namespaced: true,
  state: {
    id: null,
    name: null,
    posX: null,
    posY: null
  },
  mutations: {
    [types.SET_PLANET_ID](state, payload) {
      state.id = payload.value;
    },
    [types.SET_PLANET_NAME](state, payload) {
      state.name = payload.value;
    },
    [types.SET_PLANET_POSX](state, payload) {
      state.posX = payload.value;
    },
    [types.SET_PLANET_POSY](state, payload) {
      state.posY = payload.value;
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
    },
    setPosX: ({ commit }, value) => {
      localStorage.setItem("planetPosX", JSON.stringify(value));
      commit({
        type: types.SET_PLANET_POSX,
        value
      });
    },
    setPosY: ({ commit }, value) => {
      localStorage.setItem("planetPosY", JSON.stringify(value));
      commit({
        type: types.SET_PLANET_POSY,
        value
      });
    }
  },
  getters: {
    id: state => state.id,
    name: state => state.name,
    posX: state => state.posX,
    posY: state => state.posY
  }
};

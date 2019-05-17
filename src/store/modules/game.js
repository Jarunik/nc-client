import * as types from "../mutation-types";

export default {
  namespaced: true,
  state: {
    user: null,
    loginUser: null,
    accessToken: null,
    expiresIn: null,
    expiryDate: null,
    language: "en",
    locale: "en"
  },
  mutations: {
    [types.SET_GAME_USER](state, payload) {
      state.user = payload.value;
    },
    [types.SET_GAME_LOGINUSER](state, payload) {
      state.loginUser = payload.value;
    },
    [types.SET_GAME_ACCESSTOKEN](state, payload) {
      state.accessToken = payload.value;
    },
    [types.SET_GAME_EXPIRESIN](state, payload) {
      state.expiresIn = payload.value;
    },
    [types.SET_GAME_EXPIRYDATE](state, payload) {
      state.expiryDate = payload.value;
    },    
    [types.SET_GAME_LANGUAGE](state, payload) {
      state.language = payload.value;
    },
    [types.SET_GAME_LOCALE](state, payload) {
      state.locale = payload.value;
    }
  },
  actions: {
    setUser: ({ commit }, value) => {
      localStorage.setItem("gameUser", JSON.stringify(value));

      commit({
        type: types.SET_GAME_USER,
        value
      });
    },
    setLoginUser: ({ commit }, value) => {
      localStorage.setItem("gameLoginUser", JSON.stringify(value));

      commit({
        type: types.SET_GAME_LOGINUSER,
        value
      });
    },

    setAccessToken: ({ commit }, value) => {
      localStorage.setItem("gameAccessToken", JSON.stringify(value));

      commit({
        type: types.SET_GAME_ACCESSTOKEN,
        value
      });
    },
    setExpiresIn: ({ commit }, value) => {
      localStorage.setItem("gameExpiresIn", JSON.stringify(value));

      commit({
        type: types.SET_GAME_EXPIRESIN,
        value
      });
    },
    setExpiryDate: ({ commit }, value) => {
      localStorage.setItem("gameExpiryDate", JSON.stringify(value));

      commit({
        type: types.SET_GAME_EXPIRYDATE,
        value
      });
    },    
    setLanguage: ({ commit }, value) => {
      localStorage.setItem("gameLanguage", JSON.stringify(value));

      commit({
        type: types.SET_GAME_LANGUAGE,
        value
      });
    },
    setLocale: ({ commit }, value) => {
      localStorage.setItem("gameLocale", JSON.stringify(value));

      commit({
        type: types.SET_GAME_LOCALE,
        value
      });
    }
  },
  getters: {
    user: state => state.user,
    loginUser: state => state.loginUser,
    accessToken: state => state.accessToken,
    expiresIn: state => state.expriesIn,
    expiryDate: state => state.expiryDate,
    language: state => state.language,
    locale: state => state.locale
  }
};

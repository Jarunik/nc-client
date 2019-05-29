import Vue from "vue";
import VueI18n from "vue-i18n";
import store from "@/store";

Vue.use(VueI18n);

const messages = {
  en: require("./en.json"),
  "en-gb": require("./en.json"),
  "en-us": require("./en.json"),
  ko: require("./ko.json")
};

export default new VueI18n({
  locale: store.getters["game/language"],
  messages,
  silentTranslationWarn: false
});

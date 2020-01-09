import Vue from 'vue'
import Vuex from "vuex";
import themes from "./themes";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        config: themes[window.config.theme],
    },
    mutations: {},
    actions: {}
});

export default store;

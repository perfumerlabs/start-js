import Vue from "vue";
import VueRouter from "vue-router";
import router from "../dist/router";

Vue.use(VueRouter);

const _router = new VueRouter(router);

export default _router

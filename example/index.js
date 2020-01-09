import Vue from 'vue';
import App from './App.vue';
import router from '../dist/router';
import vuetify from '../dist/configs/vuetify';
import Storage from '../dist/configs/storage';
import store from '../dist/configs/store';

import "../dist/scss/_vuetify_main.scss";
import StartComponent from "../dist/components/StartComponent";

require('../dist/configs/axios');

Vue.component('start-component', StartComponent);

if (window.config.is_logged_in) {
    Storage.is_logged_in = true;
}

if (window.config.username) {
    Storage.username = window.config.username;
}

const app = new Vue({
    vuetify,
    el: '#root',
    components: {App},
    data: {routing: false},
    $watch: {
        routing() {
        }
    },
    template: `<app></app>`,
    router,
    store
});
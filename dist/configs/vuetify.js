import Vuetify from 'vuetify/lib';
import Theme from './themes'
import Vue from "vue";

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'md', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
    },
    theme: {
        themes: {
            light: Theme[window.config.theme].vuetify,
            dark: Theme[window.config.theme].vuetify
        },
    },
});


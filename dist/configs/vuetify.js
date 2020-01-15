import Vuetify from 'vuetify/lib';
import settings from './settings'
import Vue from "vue";

Vue.use(Vuetify);

let theme = settings.instance.themes[settings.instance.theme_name]
if (!theme || !theme.vuetify) {
    theme = settings.instance.themes["_default"]
}

export default new Vuetify({
    icons: {
        iconfont: 'md', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
    },
    theme: {
        themes: {
            light: theme.vuetify,
            dark: theme.vuetify,
        },
    },
});


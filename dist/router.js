import Vue from 'vue'
import VueRouter from 'vue-router'
import Page from './Page'

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '/page/:vendor/:page_name(.*)', component: Page, props: true},
        {path: '*', component: Page, props: true},
    ],
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        window.$scroll_position = savedPosition;
    }
});

export default router

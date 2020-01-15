import Page from './Page'

const router = {
    routes: [
        {path: '/page/:vendor/:page_name(.*)', component: Page, props: true},
        {path: '*', component: Page, props: true},
    ],
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        window.$scroll_position = savedPosition;
    }
}

export default router

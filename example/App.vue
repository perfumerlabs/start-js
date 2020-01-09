<template>
    <div>
        <v-app max-height="100%">
            <v-content class="content">
                <v-container fluid fill-height pa-0>
                    <v-layout
                            wrap
                            justify-center
                    >
                        <v-flex xs12 height="100%" class="pos-r">
                            <v-card tile
                                    p-0
                                    height="100%" max-height="100%"
                                    width="100%">
                                <router-view :key="$route.fullPath"/>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-content>

            <v-snackbar v-model="snackbar" :timeout="snackbar_timeout" :top="true" :color="snackbar_color">
                {{ snackbar_text }}
                <v-icon color="white lighten-1" @click="snackbar = false">clear</v-icon>
            </v-snackbar>
        </v-app>
    </div>
</template>

<style lang="scss" scoped>
    @import "../dist/scss/colors";

    .scrollable {
        overflow-y: scroll;
    }

    .app--sidebar {
        height: 100%;

        & > div {
            overflow-y: scroll;
        }

        .app--sidebar-close {
            background: #fff;
            border-top: 1px solid;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 500;
            width: 100%;
        }
    }

    .pos-r {
        position: relative;
    }

    .full-height-blocks {
        top: 0;
        left: 0;
        bottom: 0;

    }

    .content {
        /*position: absolute;*/
        /*left: 0;*/
        /*right: 0;*/
        /*top: 0;*/
        /*bottom: 0;*/
    }

    .flex-item:first-child {
        width: 30%;
        flex-basis: 30%;
    }

    .flex-item:last-child {
        background: $gray-f5;
    }

    @media (max-width: 959px) {
        .app--sidebar {
            z-index: 101;
            min-width: 280px;
            max-width: none;
            position: fixed;
            width: 45%;

            & > div {
                position: fixed;
                left: 0;
                width: 25%;
                bottom: 81px;
            }

            .full-height-blocks {
                position: fixed;
                top: 56px;
                min-width: 280px;
                max-width: none;
                width: 45%;
            }
        }
    }

    @media(max-width: 600px) {
        .app--sidebar {
            min-width: 100%;
            width: 100%;

            .full-height-blocks {
                top: 0;
                width: 100%;
            }
        }
    }

    @media (min-width: 960px) {
        .app--sidebar {
            z-index: 101;
            pointer-events: none;

            & > div {
                pointer-events: all;
                position: fixed;
                width: 25%;
                left: 0;
                top: 130px;
                bottom: 0;
            }
        }
        .content {
        }
    }

    @media (min-width: 1264px) {
        .app--sidebar {
            & > div {
                /*flex-basis: 16.666666666666664%;*/
                /*flex-grow: 0;*/
                /*max-width: 16.666666666666664%;*/
            }
        }
    }
</style>

<script>
    import Vuetify, {
        VApp,
        VBtn,
        VContent,
        VContainer,
        VLayout,
        VFlex,
        VFooter,
        VToolbar,
        VIcon,
        VSnackbar,
        VCard
    } from 'vuetify/lib';
    import app_components from './app_components';
    import vuetify from '../dist/configs/vuetify';
    import EventBus from '../dist/configs/eventbus'

    let components = {
        Vuetify,
        VApp,
        VBtn,
        VCard,
        VContainer,
        VContent,
        VFlex,
        VFooter,
        VIcon,
        VLayout,
        VSnackbar,
        VToolbar,
    };

    Object.assign(components, app_components);

    export default {
        name: "App",
        components: components,
        vuetify: vuetify,
        data() {
            return {
                snackbar: false,
                snackbar_color: '#212121',
                snackbar_text: null,
                snackbar_timeout: 4000,
                local: {
                    sidebar: null,
                    resizeTimer: null,
                    show_sidebar: false,
                }
            }
        },
        beforeMount() {
            $(document).click(this.clickedApp);

            document.querySelector('head title').textContent = window.config.meta.title;
        },
        mounted() {
            EventBus.$on('_snackbar', this.snackbarOpen);
        },
        beforeDestroy() {
            EventBus.$off('_snackbar', this.snackbarOpen);
        },
        methods: {
            clickedApp(e) {
                if (this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm') {
                    this.local.show_sidebar = false
                }
            },
            toggleSidebarScrollable() {
                if (this.local.sidebar == null) {
                    this.local.sidebar = $(this.$refs.sidebar);
                }
                let sidebar = this.local.sidebar;
                if (sidebar.children().getOuterHeight() > sidebar.children(":first-child").getOuterHeight()) {
                    sidebar.children().addClass('scrollable')
                } else {
                    sidebar.children().removeClass('scrollable')
                }
            },
            sizeChanged() {
                if (this.local.resizeTimer != null) {
                    window.clearTimeout(this.local.resizeTimer);
                }
                this.local.resizeTimer = window.setTimeout(this.local.toggleSidebarScrollable, 200);
            },
            toggleSidebar(showSidebar) {
                // if (this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm') {
                this.local.show_sidebar = showSidebar
                // }
                if (showSidebar) {
                    this.sizeChanged();
                }

            },
            snackbarOpen(payload) {
                this.snackbar_text = payload.text;
                this.snackbar_color = payload.color || '#212121';
                this.snackbar = true;
            }
        }
    }
</script>
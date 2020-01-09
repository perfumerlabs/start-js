<template>
    <div class="page-wrapper" :class="$store.state.config.pageWrapperClass">
        <div class="page--body">
            <div class="page--content">
                <div
                        v-if="breadcrumbs.items && breadcrumbs.items.length > 0"
                        class="page-container page-breadcrumbs"
                        :style="getPageBlocksStyle()"
                >
                    <start-breadcrumbs :$page="$page" :config="breadcrumbs"></start-breadcrumbs>
                </div>

                <div v-if="menu.length > 0" class="page-container page-submenu" :style="getPageBlocksStyle()">
                    <start-tabs :menu="menu" :$page="$page" :config="{}"></start-tabs>
                </div>

                <div v-if="top_controls.length > 0" :style="getPageBlocksStyle()"
                     class="page-top-controls page-container">
                    <start-button
                            v-for="(item, i) in top_controls"
                            :key="'top_controls_' + i"
                            :config="item"
                            :$page="$page"
                    ></start-button>
                </div>

                <div
                        v-for="component in components"
                        :key="component.name"
                        class="page-container-wrapper"
                        :style="getPageContainerWrapperStyle(component.props.config)"
                >
                    <div class="overlay" :style="getPageContainerOverlayStyle(component.props.config)"></div>

                    <div
                            class="page-container-wrapper-inner"
                            :style="getPageContainerWrapperInnerStyle(component.props.config)"
                    >
                        <start-component
                                :component="component"
                                :ref="component.name"
                        ></start-component>
                    </div>
                </div>
            </div>
        </div>
        <v-layout class="page--footer" v-if="bottom_controls.length > 0">
            <v-flex v-if="sidebarOpen" class="md3"></v-flex>
            <v-flex :class="{'md9 xs12':sidebarOpen}" :style="getPageBlocksStyle()">
                <start-button
                        v-for="(item, i) in bottom_controls"
                        :key="'bottom_controls_' + i"
                        :config="item"
                        :$page="$page"
                ></start-button>
            </v-flex>
        </v-layout>
    </div>
</template>

<style scoped lang="scss">
    .page-wrapper {
        padding-top: 56px;
        min-height: 100%;
        display: flex;
        flex-direction: column;

        &.client {
            padding-top: 104px;
        }

        &.accessibility-vi {
            padding-top: 190px;
        }
    }

    .page-container-wrapper-inner {
        z-index: 2;
    }

    .page-container-wrapper {
        position: relative;
        background: no-repeat 50% 50%;
        background-size: cover;
    }

    .overlay {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        z-index: 1;
        display: none;
    }

    .client-vi {
        .page-container-wrapper {
            filter: grayscale(100%);
        }
    }

    .page-container {
        /*position: relative;*/
        /*z-index: 2;*/
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
        background: no-repeat 50% 50%;
        background-size: cover;
    }

    .page-top-controls {
        margin-top: 16px;

        .v-btn {
            margin-left: 16px;

            &:first-of-type {
                margin-left: 0;
            }
        }
    }

    .page--body {
        flex: 1 0 auto;
        position: relative;
        padding-right: 0;
        padding-left: 0;
        background-color: #fff;
    }

    .page--footer {
        position: fixed;
        bottom: 0;
        right: 0;
        left: 0;
        padding: 8px 0;
        background-color: transparent;
        z-index: 2;

        & > div:first-child {
            min-height: 1px;
        }
        & > div:last-child {
            margin-right: auto;
            margin-left: auto;
            max-width: 1200px;
        }

        .v-btn {
            margin-left: 16px;

            &:first-of-type {
                margin-left: 0;
            }
        }
    }

    @media (min-width: 960px) {
        .page-wrapper {
            &.client {
                padding-top: 130px;
            }
            &.accessibility-vi {
                padding-top: 216px;
            }
            .page-container-wrapper-inner {
                background-color: transparent !important;
            }
        }
    }
</style>

<script>
    import Vue from 'vue';
    import axios from 'axios';
    import Vuetify, {
        VCard,
        VLayout,
        VFlex,
        VCardTitle,
        VForm,
        VToolbar,
        VToolbarItems,
        VSnackbar,
        VBtn,
        VIcon,
        VContainer
    } from 'vuetify/lib'
    import Base from "./components/Base";
    import vuetify from './configs/vuetify';
    import page_components from './configs/page_components';
    import Storage from './configs/storage';
    import Breadcrumbs from "./components/Breadcrumbs";
    import EventBus from './configs/eventbus'
    import StartComponent from "./components/StartComponent";
    import StartButton from "./components/StartButton";
    import Tabs from "./components/Tabs";

    let components = {
        Breadcrumbs,
        StartComponent,
        StartButton,
        Vuetify,
        VBtn,
        VIcon,
        VCard,
        VCardTitle,
        VContainer,
        VFlex,
        VForm,
        VLayout,
        VSnackbar,
        VToolbar,
        VToolbarItems,
        'start-breadcrumbs': Breadcrumbs,
        'start-tabs': Tabs,
    };

    Object.assign(components, page_components);

    export default {
        name: "Page",
        extends: Base,
        props: {

            sidebarOpen: {
                type: Boolean,
                default: false
            },
        },
        vuetify: vuetify,
        components: components,
        data() {
            return {
                components: [],
                $page: null,
                content_url: null,
                page_width: null,
                is_logged_in: Storage.is_logged_in,
                names: [],
                menu: [],
                breadcrumbs: [],
                top_controls: [],
                bottom_controls: [],
                configs: {},
                theme: this.$store.state.config,
                // если какая-либо страница возвращает 500, то мы запрашиваем с сервера схему 500
                // Но если и эта схема возвращает 500, то надо показать снекбар
                // Эта переменная показвает, что мы в процессе получения схемы 500 с сервера
                is_requesting_500: false,
            }
        },
        created() {
            this.$page = this;

            this.reloadPage();
        },
        mounted() {
            EventBus.$on('_403', this.status403);
            EventBus.$on('_404', this.status404);
            EventBus.$on('_500', this.status500);
            EventBus.$on('_timeout', this.statusTimeout);
            this.$on('_reload_page', this.reloadPage);

            if (window.config.editor) {
                EventBus.$on('_editor', this.editor);
            }
        },
        beforeDestroy() {
            EventBus.$off('_403', this.status403);
            EventBus.$off('_404', this.status404);
            EventBus.$off('_500', this.status500);
            EventBus.$off('_timeout', this.statusTimeout);
            this.$off('_reload_page', this.reloadPage);

            if (window.config.editor) {
                EventBus.$off('_editor', this.editor);
            }
        },
        methods: {
            getPageBlocksStyle() {
                let style = {};

                if (this.page_width) {
                    style.maxWidth = this.page_width + 'px';
                }

                return style;
            },
            getPageContainerOverlayStyle(config) {
                let style = {};

                if (config.bg_overlay) {
                    style.backgroundColor = config.bg_overlay;
                    style.display = "block";
                }

                return style;
            },
            getPageContainerWrapperStyle(config) {
                let style = {};

                if (config.bg_image && config.bg_wide) {
                    style.backgroundImage = 'url(' + config.bg_image + ')';
                }

                if (config.bg_color && config.bg_wide) {
                    style.backgroundColor = config.bg_color;
                }

                if (config.bg_position) {
                    style.backgroundPosition = config.bg_position;
                }

                if (config.bg_style && config.bg_wide) {
                    style.background = config.bg_style;
                }

                return style;
            },
            getPageContainerWrapperInnerStyle(config) {
                let style = {};

                style.paddingRight = '16px';
                style.paddingLeft = '16px';
                if (config.bg_overlay) {
                    style.position = "relative";
                }
                if (config.bg_color) {
                    style.backgroundColor = config.bg_color;
                }

                return style;
            },
            fetchByParams(route_params, query_params) {
                let page_id = route_params.page_id;
                let task_id = route_params.task_id;
                let page_name = route_params.page_name;
                let vendor = route_params.vendor;
                let url = null;

                if (page_id) {
                    url = '/ajax/start/page/' + page_id;
                } else if (task_id) {
                    url = '/ajax/start/task/' + task_id;
                } else if (vendor) {
                    url = '/ajax/page/' + vendor + '/' + page_name;
                } else if (route_params.pathMatch === '/') {
                    url = this.$store.state.config.page.home;
                } else {
                    url = this.theme.page[404];
                }

                this.fetchByUrl(url, query_params);
            },
            async fetchByUrl(url, query_params) {
                this.$root.routing = true;
                try {
                    let response = await axios.get(url, {params: query_params});

                    if (response.status === 200) {
                        let content = {};

                        if (typeof response.data.status === 'boolean') {
                            content = response.data.content;
                        } else {
                            content = response.data;
                        }

                        if (content.secured && !this.is_logged_in) {
                            let login_url = this.theme.page.login + '?redirect=' + encodeURI(this.$route.fullPath);

                            this.$router.push(login_url);

                            return;
                        }

                        this.buildSchema(content);
                    }

                    this.is_requesting_500 = false;
                } catch (error) {
                }
                this.$root.routing = false;
            },
            reloadPage() {
                this.fetchByParams(this.$route.params, this.$route.query);
            },
            snackbar(text, color = null) {
                EventBus.$emit('_snackbar', {text: text, color: color});
            },
            statusTimeout() {
                this.snackbar('Не получен ответ сервера', 'error');
            },
            status403() {
                this.snackbar('Ошибка авторизации', 'error');
            },
            status404() {
                this.snackbar('Запрашиваемый ресурс не найден', 'error');
            },
            status500(error) {
                let url = error.response.config.url;

                if (
                    !this.is_requesting_500 &&
                    url &&
                    (
                        url === '/' ||
                        url.substr(0, 17) === '/ajax/start/page/' ||
                        url.substr(0, 17) === '/ajax/start/task/' ||
                        url.substr(0, 11) === '/ajax/page/'
                    )
                ) {
                    this.is_requesting_500 = true;

                    this.fetchByUrl(this.theme.page[500]);
                } else {
                    this.snackbar('Произошла сетевая ошибка', 'error');
                }
            },
            async buildSchema(schema) {
                this.names = schema.build || [];
                this.page_width = schema.width || null;
                this.menu = schema.menu || [];
                this.breadcrumbs = {
                    items: schema.breadcrumbs || []
                };
                this.top_controls = schema.top_controls || [];
                this.bottom_controls = schema.bottom_controls || [];
                this.configs = schema.components || {};
                this.content_url = schema.content_url || null;

                this.components = this.getComponents(this.names);

                if (this.content_url) {
                    await this.fetchContent(this.content_url);
                }

                if (window.$scroll_position) {
                    this.$nextTick(() => {
                        window.scrollTo(window.$scroll_position.x, window.$scroll_position.y);
                    });
                }
            },
            getComponents(names) {
                let components = [];

                if (Array.isArray(names)) {
                    for (let i = 0; i < names.length; i++) {
                        let name = names[i];

                        if (!this.configs[name]) {
                            continue;
                        }

                        let config = this.configs[name];
                        config.name = name;
                        let has_children = false;
                        let component_children = null;

                        switch (config.type) {
                            case 'grid2':
                                has_children = true;
                                component_children = {
                                    col1: this.getComponents(config.col1),
                                    col2: this.getComponents(config.col2),
                                };
                                break;
                            case 'wrapper':
                                has_children = true;
                                component_children = this.getComponents(config.build);
                                break;
                            case 'button-bar':
                                has_children = true;
                                component_children = this.getComponents(config.build);
                                break;
                        }

                        if (this.page_width && !config.bg_width) {
                            config.bg_width = this.page_width;
                        }

                        let propsData = {
                            config: config,
                            $page: this
                        };

                        if (has_children) {
                            propsData.children = component_children;
                        }

                        let key = name;

                        // In case editor is enabled force to re-render components
                        // if (window.config.editor) {
                        key += Math.floor(10000 * Math.random());
                        // }

                        let type = config.type;

                        if (type.indexOf('/') >= 0) {
                            type = type.replace('/', '-');
                        } else {
                            type = 'start-' + type;
                        }

                        components.push({
                            type: type,
                            props: propsData,
                            name: name,
                            key: key
                        });
                    }
                }

                return components;
            },
            async fetchContent(url) {
                try {
                    let response = await
                        axios.get(url);

                    if (response.data.status) {
                        let content = response.data.content;

                        if (content && content['_breadcrumbs'] && Array.isArray(content['_breadcrumbs'])) {
                            this.breadcrumbs = {
                                items: content['_breadcrumbs']
                            };
                        }

                        if (content) {
                            this.$emit('_content', response.data.content);
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            },
            getModels(names = []) {
                let models = {};
                let keys = Object.keys(this.$refs);

                for (let i = 0; i < keys.length; i++) {
                    let ref = this.$refs[keys[i]];

                    if (!ref[0]) {
                        continue;
                    }

                    ref = ref[0];

                    let component_models = ref.getModels();

                    if (typeof component_models === 'object' && component_models !== null) {
                        Object.assign(models, component_models);
                    }
                }

                if (names.length > 0) {
                    models = Vue._.pick(models, names);
                }

                return models;
            }
            ,
            getLinkAttributes(item) {
                if (!item.to) {
                    return {};
                }

                if (item.to.substr(0, 4) === 'http') {
                    return {
                        href: item.to,
                        target: '_blank',
                        ripple: true
                    }
                } else {
                    return {
                        to: item.to,
                        ripple: true
                    }
                }
            }
            ,
            editor(payload) {
                this.buildSchema(payload);
            },
        }
    }
</script>

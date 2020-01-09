<template>
    <v-btn
            :color="color"
            :block="block"
            :link="link"
            :outlined="outlined"
            @click="click()"
            v-bind:style="style"
            :icon="icon && !text"
            :loading="loading"
            :elevation="elevation"
            :text="flat"
            :rounded="rounded"
            :large="size==='l'"
            :small="size==='s'"
            :x-large="size==='xl'"
            :x-small="size==='xs'"
            class="text-none font-weight-regular"
    >
        <v-icon color="lighten-1" v-if="icon">{{ icon }}</v-icon>
        {{text}}
    </v-btn>
</template>

<style scoped lang="scss">
</style>

<script>
    import Vue from 'vue';
    import axios from 'axios';
    import {VBtn, VIcon} from 'vuetify/lib';
    import StartBase from "./StartBase";

    export default {
        name: 'StartButton',
        extends: StartBase,
        components: {VBtn, VIcon},
        data() {
            return {
                color: null,
                text: null,
                icon: null,
                block: false,
                blank: false,
                link: false,
                elevation: null,
                outlined: false,
                rounded: false,
                flat: false,
                loading: false,
                size: null,
                replace_query: null,
                request_method: null,
                request_url: null,
                request_models: [],
                request_models_aliases: {},
                request_payload: {},
                request_confirm: false,
                request_confirm_message: null,
                actions: null,
                to: null,
                refresh_page: false,
                emit_click: null,
                emit_response_success: null,
                emit_response_failure: null,
                emit_response_success_message: null,
                emit_response_failure_message: null,
                emit_response_errors: null,
                emit_response_content: null,
                emit_request_start: null,
                emit_request_end: null,
            }
        },
        beforeMount() {
            this.init();
        },
        watch: {
            config() {
                this.init();
            }
        },
        computed: {
            // text() {
            //     return typeof this.config['text'] !== 'undefined' ? this.config['text'] : '';
            // }
        },
        methods: {
            init() {
                Vue.set(this.$data, 'text', this.getFromConfig('text', ''));
                Vue.set(this.$data, 'color', this.getFromConfig('color', ''));
                Vue.set(this.$data, 'icon', this.getFromConfig('icon'));
                Vue.set(this.$data, 'block', this.getFromConfig('block', false));
                Vue.set(this.$data, 'blank', this.getFromConfig('blank', false));
                Vue.set(this.$data, 'link', this.getFromConfig('link', false));
                Vue.set(this.$data, 'elevation', this.getFromConfig('elevation', 0));
                Vue.set(this.$data, 'rounded', this.getFromConfig('rounded', false));
                Vue.set(this.$data, 'refresh_page', this.getFromConfig('refresh_page', false));
                Vue.set(this.$data, 'flat', this.getFromConfig('flat', false));
                Vue.set(this.$data, 'outlined', this.getFromConfig('outlined', false));
                Vue.set(this.$data, 'replace_query', this.getFromConfig('replace_query'));
                Vue.set(this.$data, 'request_method', this.getFromConfig('request_method', 'post'));
                Vue.set(this.$data, 'request_url', this.getFromConfig('request_url'));
                Vue.set(this.$data, 'request_payload', this.getFromConfig('request_payload', {}));
                Vue.set(this.$data, 'request_models', this.getArrayFromConfig('request_models'));
                Vue.set(this.$data, 'request_models_aliases', this.getObjectFromConfig('request_models_aliases'));
                Vue.set(this.$data, 'request_confirm', this.getFromConfig('request_confirm', false));
                Vue.set(this.$data, 'request_confirm_message', this.getFromConfig('request_confirm_message', 'Are you sure?'));
                Vue.set(this.$data, 'actions', this.getFromConfig('actions'));
                Vue.set(this.$data, 'to', this.getFromConfig('to'));
                Vue.set(this.$data, 'emit_click', this.getFromConfig('emit_click'));
                Vue.set(this.$data, 'emit_response_success', this.getFromConfig('emit_response_success'));
                Vue.set(this.$data, 'emit_response_failure', this.getFromConfig('emit_response_failure'));
                Vue.set(this.$data, 'emit_response_success_message', this.getFromConfig('emit_response_success_message'));
                Vue.set(this.$data, 'emit_response_failure_message', this.getFromConfig('emit_response_failure_message'));
                Vue.set(this.$data, 'emit_response_errors', this.getFromConfig('emit_response_errors'));
                Vue.set(this.$data, 'emit_response_content', this.getFromConfig('emit_response_content'));
                Vue.set(this.$data, 'emit_request_start', this.getFromConfig('emit_request_start'));
                Vue.set(this.$data, 'emit_request_end', this.getFromConfig('emit_request_end'));
                let size = this.getFromConfig("size");
                if (size != null && ['xl', 'l', 's', 'xs'].indexOf(size) === -1) {
                    size = null;
                }
                this.size = size;
            },
            async click(payload = {}) {
                let models = this.$page.getModels(this.request_models);
                models = this.getModelsByAliases(models);

                this.emit(this.emit_click, models);

                if (this.request_payload) {
                    models = Object.assign(models, this.request_payload);
                }

                if (this.replace_query) {
                    let query = {};

                    if (this.replace_query === 'all') {
                        query = models;
                    } else if (this.replace_query === 'models') {
                        let route_query = {};
                        let route_keys = Object.keys(this.$route.query);

                        for (let i = 0; i < route_keys.length; i++) {
                            let key = route_keys[i];
                            route_query[key] = this.$route.query[key];
                        }

                        query = Object.assign(route_query, models);
                    }

                    this.$router.push({path: this.$route.path, query: query}).catch(err => {});
                } else if (this.request_url && ['get', 'post', 'patch', 'delete'].indexOf(this.request_method) >= 0) {
                    if (this.request_confirm && !confirm(this.request_confirm_message)) {
                        return;
                    }

                    if (payload) {
                        models = Object.assign(models, payload);
                    }

                    if (this.blank === true) {
                        let query = $.param(models);
                        window.open(this.request_url + '?' + query, '_blank');
                        return;
                    }

                    this.loading = true;

                    try {
                        this.emit(this.emit_request_start);

                        let response = null;

                        switch (this.request_method) {
                            case 'get':
                                response = await axios.get(this.request_url, {params: models});
                                break;
                            case 'post':
                                response = await axios.post(this.request_url, models);
                                break;
                            case 'patch':
                                response = await axios.patch(this.request_url, models);
                                break;
                            case 'delete':
                                response = await axios.delete(this.request_url, {params: models});
                                break;
                        }

                        this.emit(this.emit_request_end);

                        if (response.data.status) {
                            this.emit(this.emit_response_success);

                            if (response.data.message) {
                                if (this.emit_response_success_message) {
                                    this.emit(this.emit_response_success_message, {"text": response.data.message});
                                } else {
                                    this.snackbar(response.data.message, 'success');
                                }
                            }

                            if (response.data.content) {
                                this.emit('_content', response.data.content);
                            }

                            this.processActionScenario(response.data.content);
                            this.processTo();
                        } else {
                            if (response.data.message) {
                                if (this.emit_response_failure_message) {
                                    this.emit(this.emit_response_failure_message, {"text": response.data.message});
                                } else {
                                    this.snackbar(response.data.message, 'error');
                                }
                            }

                            if (response.data.errors) {
                                this.emit(this.emit_response_errors, response.data.errors);
                            }
                        }
                    } catch (error) {
                    }

                    this.loading = false;
                } else {
                    this.processActionScenario();
                    this.processTo();
                }
            },
            processActionScenario(response = null) {
                if (!this.actions) {
                    return;
                }

                let actions = this.actions;

                if (typeof actions === 'string') {
                    actions = [actions];
                }

                for (let i = 0; i < actions.length; i++) {
                    let action = actions[i];

                    if (action === 'close_task') {
                        // this.closeTask();
                    }

                    if (action === 'login') {
                        let payload = {};

                        if (response && response.username) {
                            payload.username = response.username;
                        }

                        this.login(payload);
                    }

                    if (action === 'logout') {
                        this.logout();
                    }

                    if (action === 'reload') {
                        this.reload();
                    }

                    if (action === 'reload_menu') {
                        this.reloadMenu();
                    }

                    if (action === 'reload_page') {
                        this.reloadPage();
                    }
                }
            },
            processTo() {
                if (!this.to) {
                    return;
                }

                if (this.to === 'back') {
                    this.$router.back();
                } else if (this.blank === true) {
                    window.open(this.to, '_blank');
                } else if (this.to.substr(0, 4) === 'http') {
                    window.open(this.to, '_blank');
                } else if (this.refresh_page) {
                    location.replace(this.to);
                } else {
                    this.$router.push(this.to);
                }
            },
            setContent(payload) {
                if (!this.content_key || !payload[this.content_key]) {
                    return;
                }

                let content = payload[this.content_key];

                if (typeof content.to !== 'undefined') {
                    this.to = content.to;
                }
            },
            getModelsByAliases(models) {
                let keys = Object.keys(this.request_models_aliases);

                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];

                    if (typeof models[key] !== 'undefined') {
                        models[this.request_models_aliases[key]] = models[key];
                        delete models[key];
                    }
                }

                return models;
            }
        }
    }
</script>
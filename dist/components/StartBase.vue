<script>
    import Vue from 'vue';
    import axios from 'axios';
    import EventBus from '../configs/eventbus';
    import vuetify from '../configs/vuetify';
    import Vuetify from 'vuetify/lib';
    import Base from "./Base";

    export default {
        name: 'StartBase',
        vuetify,
        extends: Base,
        components: {Vuetify},
        props: {
            config: {},
            $page: null,
        },
        watch: {
            config() {
                this.baseInit();
            }
        },
        data() {
            return {
                content_url: null,
                content_key: null,
                style: {},
            }
        },
        computed: {
            theme() {
                return this.$store.state.config;
            }
        },
        beforeMount() {
            this.baseInit();
        },
        mounted() {
            if (this.content_key) {
                this.$page.$on('_content', this.setContent);
            }
        },
        beforeDestroy() {
            if (this.content_key) {
                this.$page.$off('_content', this.setContent);
            }
        },
        methods: {
            snackbar(text, color = null) {
                this.$page.snackbar(text, color);
            },
            baseInit() {
                Vue.set(this.$data, 'content_url', this.getFromConfig('content_url'));
                Vue.set(this.$data, 'content_key', this.getFromConfig('content_key'));
                Vue.set(this.$data, 'style', this.getObjectFromConfig('style'));

                if (this.content_url && this.content_key) {
                    this.fetchContent();
                }

                if (!this.content_key) {
                    this.content_key = this.getFromConfig('name');
                }
            },
            async fetchContent(params = {}) {
                if (!this.content_url || !this.content_key) {
                    return;
                }

                try {
                    let response = await axios.get(this.content_url, {params: params});

                    if (response.data.status) {
                        this.setContent(response.data.content);
                    }
                } catch (error) {

                }
            },
            setContent(payload) {
            },
            getFromConfig(key, default_value = null) {
                return typeof this.config[key] !== 'undefined' ? this.config[key] : default_value;
            },
            getArrayFromConfig(key) {
                return Array.isArray(this.config[key]) ? this.config[key] : [];
            },
            getObjectFromConfig(key) {
                return typeof this.config[key] === 'object' && this.config[key] !== null ? this.config[key] : {};
            },
            getModels() {
                return null;
            },
            getFromContent(content, key) {
                return key ? content[key] : content;
            },
            reload() {
                EventBus.$emit('_reload');
            },
            reloadPage() {
                this.$page.$emit('_reload_page');
            },
            reloadMenu() {
                EventBus.$emit('_reload_menu');
            },
            login(payload = null) {
                EventBus.$emit('_login', payload);
            },
            logout() {
                EventBus.$emit('_logout');
            },
            closeTask() {
                EventBus.$emit('_close_task');
            },
            emit(event, payload = null) {
                if (event) {
                    this.$page.$emit(event, payload);
                }
            },
            on(event, callback) {
                if (event) {
                    if (Array.isArray(event)) {
                        for (let i = 0; i < event.length; i++) {
                            this.$page.$on(event[i], callback);
                        }
                    } else {
                        this.$page.$on(event, callback);
                    }
                }
            },
            off(event, callback) {
                if (event) {
                    if (Array.isArray(event)) {
                        for (let i = 0; i < event.length; i++) {
                            this.$page.$off(event[i], callback);
                        }
                    } else {
                        this.$page.$off(event, callback);
                    }
                }
            },
            getLinkAttributes(item) {
                if (!item.to) {
                    return {
                        ripple: false
                    };
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
        }
    }
</script>
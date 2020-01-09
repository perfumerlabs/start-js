<script>
    import vuetify from '../configs/vuetify';

    export default {
        vuetify: vuetify,
        data() {
            return {
                local: {
                    loading: false
                }
            }
        },
        computed: {
            is_dev() {
                return process.env.NODE_ENV === 'development'
            },
            is_ordinary() {
                return [
                    "visually_impaired",
                    "visually_impaired_dark",
                    "visually_impaired_blue"
                ].indexOf(window.config.theme) === -1
            },
            is_vi_theme() {
                return window.config.theme === "visually_impaired"
            },
            is_vi_theme_dark() {
                return false
            },
            is_vi_theme_blue() {
                return false
            },
            theme_class() {
                return this.$store.state.config.theme_class;
            }
        },
        watch: {
            theme_class(new_class, old_class) {
                this.updateThemeClass(new_class, old_class);
            }
        },
        mounted() {
            if (this.theme_class != null) {
                this.updateThemeClass(this.theme_class, null);
            }
        },
        methods: {
            updateThemeClass(new_class, old_class) {
                if (this.$el) {
                    let el_class = this.$el.className;
                    if (el_class === "" || el_class == null) {
                        el_class = [];
                    } else {
                        el_class = el_class.split(' ');
                    }

                    if (old_class != null) {
                        let index = el_class.indexOf(old_class);
                        if (index > -1) {
                            el_class.splice(index, 1);
                        }
                    }
                    if (new_class != null)
                        el_class.push(new_class);
                    this.$el.className = el_class.join(' ');
                }
            },
        }
    }
</script>

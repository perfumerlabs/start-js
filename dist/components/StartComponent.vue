<template>
    <div
            :class="getContainerClass(component.props.config)"
            :style="getContainerStyle(component.props.config)"
    >
        <div
                :class="getContainerInnerClass(component.props.config)"
                :style="getContainerInnerStyle(component.props.config)"
        >
            <component
                    v-bind="component.props"
                    :key="component.key"
                    :is="component.type"
                    :ref="component.name"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>

<script>
    import page_components from '../configs/components';

    export default {
        name: 'start-component',
        components: page_components,
        props: {
            component: {
                type: Object
            },
            visible: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            getContainerClass(config) {
                let _class = ['page-container'];

                if (typeof config.align !== 'undefined') {
                    _class.push(config.align);
                }

                if (typeof config.margin !== 'undefined') {
                    _class.push(config.margin);
                } else if (typeof config.mgt !== 'undefined') {
                    let mgt = parseInt(config.mgt);

                    if (mgt < 0) {
                        mgt = 0;
                    }

                    if (mgt > 10) {
                        mgt = 10;
                    }

                    _class.push('mgt-' + mgt);
                } else {
                    _class.push('mgt-2');
                }

                return _class;
            },
            getContainerStyle(config) {
                let style = {};

                return style;
            },
            getContainerInnerClass(config) {
                let _class = ['page-container-inner'];

                if (typeof config.padding !== 'undefined') {
                    _class.push(config.padding);
                }

                return [_class];
            },
            getContainerInnerStyle(config) {
                let style = {};

                if (config.bg_image && !config.bg_wide) {
                    style.backgroundImage = 'url(' + config.bg_image + ')';
                    style.padding = '16px';
                }

                if (config.bg_color && !config.bg_wide) {
                    style.backgroundColor = config.bg_color;
                    style.padding = '16px';
                }

                if (config.bg_width) {
                    style.maxWidth = config.bg_width + 'px';
                }

                if (config.bg_radius) {
                    style.borderRadius = config.bg_radius + 'px';
                }

                if (config.bg_border) {
                    style.border = config.bg_border;
                    style.padding = '16px';
                }

                return style;
            },
            getModels() {
                let models = {};
                let keys = Object.keys(this.$refs);

                for (let i = 0; i < keys.length; i++) {
                    let ref = this.$refs[keys[i]];

                    let component_models = ref.getModels();

                    if (typeof component_models === 'object' && component_models !== null) {
                        Object.assign(models, component_models);
                    }
                }

                return models;
            },
        }
    }
</script>

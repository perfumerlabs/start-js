<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-tabs
            class="tab-menu"
            center-active>
        <v-tab
                v-for="(item, i) in items"
                :key="i"
                v-bind="getLinkAttributes(item)"
                active-class="primary-text">
            <v-badge
                    :overlap="false"
                    color="teal">
                <template v-slot:badge v-if="item.badge">
                    <span>{{ item.badge }}</span>
                </template>
                <v-layout class="align-center">
                    <v-flex
                            v-if="item.icon"
                            :class="{'mgr-1': item.text}">
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-flex>
                    <v-flex
                            class="pdr-1-2"
                            v-if="item.text">{{ item.text }}
                    </v-flex>
                </v-layout>
            </v-badge>
        </v-tab>
    </v-tabs>
</template>

<style lang="scss">
    .tab-menu {
        border-bottom: 1px solid #E6E6E6;
    }
</style>

<script>
    import {
        VBadge,
        VFlex,
        VIcon,
        VLayout,
        VTabs,
        VTab,
    } from 'vuetify/lib';
    import StartBase from './StartBase';

    export default {
        name: "Tabs",
        extends: StartBase,
        components: {
            VBadge,
            VFlex,
            VIcon,
            VLayout,
            VTabs,
            VTab,
        },
        props: {
            menu: {
                type: Array,
                default: () => ([])
            }
        },
        data() {
            return {
                items: []
            }
        },
        beforeMount() {
            this.items = this.getArrayFromConfig('items');

            if (this.menu.length > 0) {
                this.items = this.menu;
            }
        },
        methods: {}
    }
</script>
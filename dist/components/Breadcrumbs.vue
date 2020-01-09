<template>
    <v-breadcrumbs :items="breadcrumbs" divider=">"></v-breadcrumbs>
</template>

<style scoped lang="scss">
</style>

<script>
    import {VBreadcrumbs} from 'vuetify/lib';
    import StartBase from "./StartBase";

    export default {
        name: 'Breadcrumbs',
        extends: StartBase,
        components: {VBreadcrumbs},
        data() {
            return {
                items: [],
                breadcrumbs: [],
            }
        },
        beforeMount() {
            this.items = this.getArrayFromConfig('items');

            for (let i = 0; i < this.items.length; i++) {
                let breadcrumb = this.items[i];

                let text = breadcrumb.text;
                let to = breadcrumb.to;
                let disabled = (i === this.items.length - 1);

                this.breadcrumbs.push({
                    text: text,
                    to: to,
                    disabled: disabled,
                    exact: true
                });
            }
        },
    }
</script>
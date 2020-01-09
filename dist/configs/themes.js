'use strict';

let _options = {
    page: {
        home: "/ajax/page/home.json",
        404: "/ajax/page/start/404",
        500: "/ajax/page/start/500",
    },
    host: {
        upload: window.config.host.upload,
        static: window.config.host.static
    },
}

export default {
    _default: {
        ..._options,
        app_bar: {
            text_color: '#fff',
            bg_color: '#002940',
            taskBar: true
        },
        second_app_bar: {
            bg_color: "#fff",
            text_color: "#000"
        },
        colors: {
            main_black: "#0A1F44",
            tag_text: "#182C4F",
            list_dropdown_bg: "#F2F4F8"
        },
        vuetify: {
            primary: '#2E8BCB',
            secondary: '#FAB336',
            accent: '#E83B7F',
            error: '#BE1824',
            info: '#2E8BCB',
            success: '#32AD69',
            warning: '#FAB336',
        },
        context: 1,
        pageWrapperClass: "client",
        theme_class: "super-class"
    }
}
;

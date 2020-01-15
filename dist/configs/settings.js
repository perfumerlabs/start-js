import themes from "./themes";

const settings = {
    _instance: null,
    get instance() {
        if (!this._instance) {
            this._instance = {
                _theme_name: "_default",
                get theme_name() {
                    return this._theme_name;
                },
                set theme_name(value) {
                    this._theme_name = value;
                },
                _themes: themes,
                get themes() {
                    return this._themes;
                },
                set themes(value) {
                    this._themes = value;
                },
            };
        }
        return this._instance;
    }
};

export default settings;
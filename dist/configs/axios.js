import axios from 'axios'
import EventBus from './eventbus'
// axios.defaults.timeout = 1;
axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    console.log(error);

    if (error.code === 'ECONNABORTED') {
        EventBus.$emit('_timeout', error);
    } else {
        switch (error.response.status) {
            case 403:
                EventBus.$emit('_403', error);
                break;
            case 404:
                EventBus.$emit('_404', error);
                break;
            default:
                EventBus.$emit('_500', error);
                break;
        }
    }

    return Promise.reject(error);
});
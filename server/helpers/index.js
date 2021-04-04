import i18next from 'i18next';
import _ from 'lodash';

export default () => ({
    t(key) {
        return i18next.t(key);
    },
    _,
});

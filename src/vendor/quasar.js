import Vue from 'vue';

import '../styles/quasar.scss';
import lang from 'quasar/lang/zh-hans.js';
import '@quasar/extras/material-icons/material-icons.css';
import { Quasar, ClosePopup, Notify, Loading } from 'quasar';

Vue.use(Quasar, {
  config: {},
  components: {
    /* not needed if importStrategy is not 'manual' */
  },
  directives: {
    /* not needed if importStrategy is not 'manual' */
    ClosePopup,
  },
  plugins: {
    Notify,
    Loading,
  },
  lang: lang,
});

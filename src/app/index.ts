/* ============
 * Main File
 * ============
 *
 * Will initialize the application.
 */

import Vue from 'vue';

/* ============
 * Plugins
 * ============
 *
 * Import and bootstrap the plugins.
 * The order is important!
 */

import '@/app/plugins/jquery.plugin';
import '@/app/plugins/vue-event-bus.plugin';
import '@/app/plugins/logger.plugin';
import '@/app/plugins/vuex.plugin';
import '@/app/plugins/axios.plugin';

/* ============
 * Styling
 * ============
 *
 * Import the application styling.
 * Sass is used for this boilerplate.
 *
 * https://sass-lang.com/
 */

import '@/styles/main.scss';

/* ============
 * Main App
 * ============
 *
 * Last but not least, we import the main application.
 */

import App from '@/app/App.vue';
import { store } from '@/app/store/index';
import { appConfig } from '@/config/app.config';

Vue.config.productionTip = appConfig.env !== 'Production';

new Vue({

  /**
   * The Vuex store.
   */
  store,

  /**
   * Will render the application.
   *
   * @param {Function} h Will create an element.
   */
  render: (h) => h(App),
})
  /**
   * Bind the Vue instance to the HTML.
   */
  .$mount('#app');

const log = Vue.$createLogger('main');
log.info(`The environment is ${appConfig.env}.`);

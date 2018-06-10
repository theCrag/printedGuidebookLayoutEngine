/* ============
 * Vue Event Bus
 * ============
 *
 * The event bus / publish-subscribe pattern, despite the bad press it sometimes gets,
 * is still an excellent way of getting unrelated sections of your application to talk to each other
 *
 * https://medium.com/vuejobs/create-a-global-event-bus-in-vue-js-838a5d9ab03a
 */

import Vue from 'vue';
import { PluginObject, PluginFunction } from 'vue';

export const EventBus = new Vue();

export const VueEventBusPlugin: PluginObject<any> = {
  install(VueInstance, options: { i18n: any }): void {

    VueInstance.prototype.$eventBus = EventBus;

  },
};

Vue.use(VueEventBusPlugin);

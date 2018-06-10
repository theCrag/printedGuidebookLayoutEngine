/* ============
 * Logger
 * ============
 *
 * Lightweight, unobtrusive, configurable JavaScript logger.
 *
 * https://github.com/jonnyreeves/js-logger
 */

import Vue from 'vue';
import { PluginObject, PluginFunction } from 'vue';
import * as logdown from 'logdown';

import { appConfig } from '@/config/app.config';

const LOCAL_STORAGE_KEY = 'debug';

const logdownConfig = {
  markdown: true,
  isEnabled: appConfig.isLogEnabled === 'true',
};

if (logdownConfig.isEnabled) {
  if (localStorage.getItem(LOCAL_STORAGE_KEY) === null) {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'app:*');
  }
} else {
  localStorage.setItem(LOCAL_STORAGE_KEY, '');
}

export const Logger: PluginObject<any> = {
  install(VueInstance, options): void {

    VueInstance.$createLogger = (prefix: string) => {
      return (logdown as any)(`app:${prefix}`, logdownConfig);
    };

    VueInstance.prototype.$createLogger = (prefix: string) => {
      return (logdown as any)(`app:${prefix}`, logdownConfig);
    };

  },
};

Vue.use(Logger);

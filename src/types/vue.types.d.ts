import Vue from 'vue';

import { AxiosInstance } from 'axios';

declare module 'vue/types/vue' {

  interface VueConstructor {
    $createLogger: (prefix: string) => any;
    $http: AxiosInstance;
  }

  interface IEventBus {
    $on(event: string | string[], callback: Function): this;
    $once(event: string, callback: Function): this;
    $off(event?: string | string[], callback?: Function): this;
    $emit(event: string, ...args: any[]): this;
  }

  interface Vue {
    $createLogger: (prefix: string) => any;
    $http: AxiosInstance;
    $eventBus: IEventBus;
  }
}

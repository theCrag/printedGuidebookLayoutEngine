import Vue from 'vue';

import { AxiosInstance } from 'axios';

declare module 'vue/types/vue' {

  interface VueConstructor {
    $createLogger: (prefix: string) => any;
    $http: AxiosInstance;
  }

  interface Vue {
    $createLogger: (prefix: string) => any;
    $http: AxiosInstance;
  }
}

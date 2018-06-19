import Vue from 'vue';
import { MutationTree } from 'vuex';

import * as mutationTypes from './book.mutations.types';
import { BookState } from './book.state';
import { Area } from '@/app/models/Area';
import { Sheet } from '@/app/models/Sheet';

const log = Vue.$createLogger('BookMutations');

export const mutations: MutationTree<BookState> = {
  [mutationTypes.SET_NEW_AREA](state: BookState, area: Area): void {
    state.area = area;
    state.sheets = [new Sheet(1)];
  },

  [mutationTypes.ADD_CONTENT](state: BookState, newContent: any): void {
    log.info('before', newContent);
    const content = state.sheets[state.sheets.length - 1].content;
    state.sheets[state.sheets.length - 1].content = [
      ...content,
      newContent,
    ];
    log.info('after');
  },

  [mutationTypes.SET_LAYOUTS](state: BookState, layouts: any): void {
    state.layouts = layouts;
  },

  [mutationTypes.SET_SHEETS](state: BookState, sheets: any): void {
    state.sheets = sheets;
  },

};

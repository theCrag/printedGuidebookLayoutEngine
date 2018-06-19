import Vue from 'vue';
import { MutationTree } from 'vuex';

import * as mutationTypes from './book.mutations.types';
import { BookState } from './book.state';
import { Area } from '@/app/models/Area';
import { Sheet } from '@/app/models/Sheet';

const log = Vue.$createLogger('BookMutations');

export const mutations: MutationTree<BookState> = {

  [mutationTypes.ADD_CONTENT](state: BookState, newContent: any): void {
    log.info('before', newContent);
    const content = state.sheets[state.sheets.length - 1].content;
    state.sheets[state.sheets.length - 1].content = [
      ...content,
      newContent,
    ];
    log.info('after');
  },

  [mutationTypes.SET_SHEETS](state: BookState): void {
    const change = state.sheets[state.sheets.length - 1].content.pop();
    state.sheets.push(new Sheet(state.sheets.length + 1));
    state.sheets[state.sheets.length - 1].content.push(change);
  },

};

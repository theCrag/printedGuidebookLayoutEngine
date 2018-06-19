import Vue from 'vue';
import { MutationTree } from 'vuex';

import * as mutationTypes from './book.mutations.types';
import { BookState } from './book.state';
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

  [mutationTypes.GO_TO_NEXT_PAGE](state: BookState): void {
    const change = state.sheets[state.sheets.length - 1].content.pop();
    state.sheets.push(new Sheet(state.sheets.length + 1));
    state.sheets[state.sheets.length - 1].content.push(change);
  },

  [mutationTypes.GO_TO_NEXT_PAGE_DESC](state: BookState, changes: { elementOldPage: any, elementNewPage: any }): void {
      const lastElement = state.sheets[state.sheets.length - 1].content.length - 1;
      // const last = state.sheets[state.sheets.length - 1].content[lastElement].value.descriptions.pop();

    // state.sheets.push(new Sheet(state.sheets.length + 1));
    // state.sheets[state.sheets.length - 1].content.push(copy);
  },

};

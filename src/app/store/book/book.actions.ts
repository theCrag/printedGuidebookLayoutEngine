import Vue from 'vue';
import { ActionContext, ActionTree } from 'vuex';

import * as mutationTypes from './book.mutations.types';
import { BookState } from './book.state';

const log = Vue.$createLogger('BookActions');

// -------------------------------------------------------------------------
// Define Types & Interfaces
// -------------------------------------------------------------------------

// -------------------------------------------------------------------------
// Define Action Types
// -------------------------------------------------------------------------

export const actionTypes = {
  ADD_CONTENT: 'ADD_CONTENT',
  GO_TO_NEXT_PAGE: 'GO_TO_NEXT_PAGE',
};

// -------------------------------------------------------------------------
// Define Action Object
// -------------------------------------------------------------------------

export const actions: ActionTree<BookState, BookState> = {

  /**
   *
   */
  [actionTypes.ADD_CONTENT]({ commit, state }: ActionContext<BookState, BookState>, obj: any): void {
    log.info('ADD_CONTENT', obj);
    commit(mutationTypes.ADD_CONTENT, obj);
  },

  /**
   *
   */
  [actionTypes.GO_TO_NEXT_PAGE]({ commit, state }: ActionContext<BookState, BookState>): void {
    log.info('GO_TO_NEXT_PAGE');
    commit(mutationTypes.SET_SHEETS);
  },
};

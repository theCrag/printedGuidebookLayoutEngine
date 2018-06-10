import Vue from 'vue';
import { ActionContext, ActionTree } from 'vuex';

import * as cragApi from '@/app/services/api/crag.api';
import * as mutationTypes from './book.mutations.types';
import { BookState } from './book.state';
import { Area } from '@/app/models/Area';

const log = Vue.$createLogger('BookActions');

// -------------------------------------------------------------------------
// Define Types & Interfaces
// -------------------------------------------------------------------------

// -------------------------------------------------------------------------
// Define Action Types
// -------------------------------------------------------------------------

export const actionTypes = {
  FETCH_AREA: 'FETCH_AREA',
  ADD_CONTENT: 'ADD_CONTENT',
};

// -------------------------------------------------------------------------
// Define Action Object
// -------------------------------------------------------------------------

export const actions: ActionTree<BookState, BookState> = {
  [actionTypes.FETCH_AREA]({ commit, state }: ActionContext<BookState, BookState>): void {
    cragApi.fetchArea('')
      .then((area: Area) => commit(mutationTypes.SET_NEW_AREA, area));

  },
  [actionTypes.ADD_CONTENT]({ commit, state }: ActionContext<BookState, BookState>, obj: any): void {
    log.info('ADD_CONTENT', obj);
    commit(mutationTypes.ADD_CONTENT, obj);
  },
};

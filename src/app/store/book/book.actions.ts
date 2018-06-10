import { ActionContext, ActionTree } from 'vuex';

import * as cragApi from '@/app/services/api/crag.api';
import * as mutationTypes from './book.mutations.types';
import { BookState } from './book.state';
import { Area } from '@/app/models/Area';

// -------------------------------------------------------------------------
// Define Types & Interfaces
// -------------------------------------------------------------------------

// -------------------------------------------------------------------------
// Define Action Types
// -------------------------------------------------------------------------

export const actionTypes = {
  FETCH_AREA: 'FETCH_AREA',
};

// -------------------------------------------------------------------------
// Define Action Object
// -------------------------------------------------------------------------

export const actions: ActionTree<BookState, BookState> = {
  [actionTypes.FETCH_AREA]({ commit, state }: ActionContext<BookState, BookState>): void {

    cragApi.fetchArea('')
      .then((area: Area) => commit(mutationTypes.SET_NEW_AREA, area));

  },
};

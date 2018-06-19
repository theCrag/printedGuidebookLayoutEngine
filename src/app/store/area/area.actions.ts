import Vue from 'vue';
import { ActionContext, ActionTree } from 'vuex';

import * as cragApi from '@/app/services/api/crag.api';
import * as mutationTypes from './area.mutations.types';
import { AreaState } from './area.state';
import { Area } from '@/app/models/Area';
import { buildAreaLayouts } from '@/app/services/utils/layout.service';

const log = Vue.$createLogger('AreaActions');

// -------------------------------------------------------------------------
// Define Types & Interfaces
// -------------------------------------------------------------------------

// -------------------------------------------------------------------------
// Define Action Types
// -------------------------------------------------------------------------

export const actionTypes = {
  FETCH_AREA: 'FETCH_AREA',
  BUILD_LAYOUTS: 'BUILD_LAYOUTS',
};

// -------------------------------------------------------------------------
// Define Action Object
// -------------------------------------------------------------------------

export const actions: ActionTree<AreaState, AreaState> = {

  /**
   *
   */
  [actionTypes.FETCH_AREA]({ commit, dispatch }: ActionContext<AreaState, AreaState>): void {
    cragApi.fetchArea('')
      .then((area: Area) => {
        commit(mutationTypes.SET_NEW_AREA, area);
        dispatch(actionTypes.BUILD_LAYOUTS, area);
      });
  },

  /**
   *
   */
  [actionTypes.BUILD_LAYOUTS]({ commit, state }: ActionContext<AreaState, AreaState>, area: Area): void {
    const layouts = buildAreaLayouts(area);
    log.info('BUILD_LAYOUTS', layouts);
    commit(mutationTypes.SET_LAYOUTS);
  },

};

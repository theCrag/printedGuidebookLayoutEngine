import Vue from 'vue';
import { MutationTree } from 'vuex';

import * as mutationTypes from './area.mutations.types';
import { AreaState } from './area.state';
import { Area } from '@/app/models/Area';

const log = Vue.$createLogger('AreaMutations');

export const mutations: MutationTree<AreaState> = {
  [mutationTypes.SET_NEW_AREA](state: AreaState, area: Area): void {
    state.area = area;
  },

  [mutationTypes.SET_LAYOUTS](state: AreaState): void {
    state.hasInitialized = true;
  },

};

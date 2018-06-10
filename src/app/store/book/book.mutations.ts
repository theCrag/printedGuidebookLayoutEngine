import Vue from 'vue';
import { MutationTree } from 'vuex';

import * as mutationTypes from './book.mutations.types';
import { BookState } from './book.state';
import { Area } from '@/app/models/Area';

export const mutations: MutationTree<BookState> = {
  [mutationTypes.SET_NEW_AREA](state: BookState, area: Area): void {
    state.area = area;
    state.pages = [];
  },

};

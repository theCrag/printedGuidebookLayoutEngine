import Vue from 'vue';
import { MutationTree } from 'vuex';

import * as mutationTypes from './book.mutations.types';
import { BookState } from './book.state';
import { Area } from '@/app/models/Area';
import { Sheet } from '@/app/models/Sheet';

export const mutations: MutationTree<BookState> = {
  [mutationTypes.SET_NEW_AREA](state: BookState, area: Area): void {
    state.area = area;
    state.sheets = [new Sheet(1)];
  },

  [mutationTypes.ADD_CONTENT](state: BookState, obj: any): void {
    state.sheets[state.sheets.length - 1].content.push(obj);
  },

  [mutationTypes.SET_LAYOUTS](state: BookState, layouts: any): void {
    state.layouts = layouts;
  },

};

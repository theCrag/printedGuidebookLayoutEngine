import { find } from 'lodash';

import { BookState } from './book.state';
import { Sheet } from '@/app/models/Sheet';

// -------------------------------------------------------------------------
// Define Getter Types
// -------------------------------------------------------------------------

export const getterTypes = {
  GetPages: 'GetPages',
  GetPageById: 'GetPageById',
  GetPageSize: 'GetPageSize',
  HasInitialized: 'HasInitialized',
};

// -------------------------------------------------------------------------
// Define Getter Object
// -------------------------------------------------------------------------

export const getters = {

  [getterTypes.GetPages](state: BookState): Sheet[] {
    return state.sheets;
  },

  [getterTypes.GetPageById]: (state: BookState) => (id: string) => {
    return find(state.sheets, { id }) as Sheet | undefined;
  },

  [getterTypes.GetPageSize](state: BookState, id: string): number {
    return state.sheets.length;
  },

  [getterTypes.HasInitialized](state: BookState): boolean {
    return state.hasInitialized;
  },

};

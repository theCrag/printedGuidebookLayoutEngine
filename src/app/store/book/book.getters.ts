import { BookState } from './book.state';
import { Sheet } from '@/app/models/Sheet';
import { Area } from '@/app/models/Area';

// -------------------------------------------------------------------------
// Define Getter Types
// -------------------------------------------------------------------------

export const getterTypes = {
  GetArea: 'GetArea',
  GetPages: 'GetPages',
};

// -------------------------------------------------------------------------
// Define Getter Object
// -------------------------------------------------------------------------

export const getters = {
  [getterTypes.GetArea](state: BookState): Area {
    return state.area;
  },
  [getterTypes.GetPages](state: BookState): Sheet[] {
    return state.sheets;
  },
};

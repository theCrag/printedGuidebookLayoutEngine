import { BookState } from './book.state';
import { Sheet } from '@/app/models/Sheet';
import { Area } from '@/app/models/Area';
import { AreaLayout } from '@/app/models/AreaLayout';

// -------------------------------------------------------------------------
// Define Getter Types
// -------------------------------------------------------------------------

export const getterTypes = {
  GetArea: 'GetArea',
  GetPages: 'GetPages',
  GetLayouts: 'GetLayouts',
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
  [getterTypes.GetLayouts](state: BookState): AreaLayout[] {
    return state.layouts;
  },
};

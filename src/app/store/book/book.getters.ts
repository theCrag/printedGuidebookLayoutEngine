import { BookState } from './book.state';
import { Page } from '@/app/models/Page';
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
  [getterTypes.GetPages](state: BookState): Page[] {
    return state.pages;
  },
};

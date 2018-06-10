import { Page } from '@/app/models/Page';
import { Area } from '@/app/models/Area';

export interface BookState {
  area: Area;
  pages: Page[];
}

export const initialState: BookState = {
  area: new Area(),
  pages: [],
};

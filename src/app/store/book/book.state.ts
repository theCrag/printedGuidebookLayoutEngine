import { AreaLayout } from './../../models/AreaLayout';
import { Sheet } from '@/app/models/Sheet';
import { Area } from '@/app/models/Area';

export interface BookState {
  area: Area;
  layouts: AreaLayout[];
  sheets: Sheet[];
}

export const initialState: BookState = {
  area: new Area(),
  layouts: [],
  sheets: [],
};

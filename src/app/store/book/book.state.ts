import { Sheet } from '@/app/models/Sheet';
import { Area } from '@/app/models/Area';

export interface BookState {
  area: Area;
  sheets: Sheet[];
}

export const initialState: BookState = {
  area: new Area(),
  sheets: [],
};

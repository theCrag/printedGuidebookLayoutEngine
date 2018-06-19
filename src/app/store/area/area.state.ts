import { AreaLayout } from '@/app/models/AreaLayout';
import { Area } from '@/app/models/Area';

export interface AreaState {
  area: Area;
  hasInitialized: boolean;
}

export const initialState: AreaState = {
  area: new Area(),
  hasInitialized: false,
};

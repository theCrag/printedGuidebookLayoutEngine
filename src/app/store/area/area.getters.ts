import { AreaState } from './area.state';
import { Area } from '@/app/models/Area';
import { AreaLayout } from '@/app/models/AreaLayout';

// -------------------------------------------------------------------------
// Define Getter Types
// -------------------------------------------------------------------------

export const getterTypes = {
  GetArea: 'GetArea',
  HasInitialized: 'HasInitialized',
};

// -------------------------------------------------------------------------
// Define Getter Object
// -------------------------------------------------------------------------

export const getters = {
  [getterTypes.GetArea](state: AreaState): Area {
    return state.area;
  },
  [getterTypes.HasInitialized](state: AreaState): boolean {
    return state.hasInitialized;
  },
};

import { actions, actionTypes } from './area.actions';
import { getters, getterTypes } from './area.getters';
import { mutations } from './area.mutations';
import { initialState } from './area.state';

// -------------------------------------------------------------------------
// Export Types & Interfaces
// -------------------------------------------------------------------------

export * from './area.state';

// -------------------------------------------------------------------------
// Define Namespace, Actions & Getters
// -------------------------------------------------------------------------

export const AreaNamespace = 'area';

export const AreaActions = {
  FetchArea: `${AreaNamespace}/${actionTypes.FETCH_AREA}`,
};

export const AreaGetters = {
  GetArea: `${AreaNamespace}/${getterTypes.GetArea}`,
  HasInitialized: `${AreaNamespace}/${getterTypes.HasInitialized}`,
};

// -------------------------------------------------------------------------
// Export Store
// -------------------------------------------------------------------------

export const area = {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations,
};

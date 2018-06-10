import { actions, actionTypes } from './book.actions';
import { getters, getterTypes } from './book.getters';
import { mutations } from './book.mutations';
import { initialState } from './book.state';

// -------------------------------------------------------------------------
// Export Types & Interfaces
// -------------------------------------------------------------------------

export * from './book.state';

// -------------------------------------------------------------------------
// Define Namespace, Actions & Getters
// -------------------------------------------------------------------------

export const BookNamespace = 'book';

export const BookActions = {
  FetchArea: `${BookNamespace}/${actionTypes.FETCH_AREA}`,
};

export const BookGetters = {
  GetArea: `${BookNamespace}/${getterTypes.GetArea}`,
  GetPages: `${BookNamespace}/${getterTypes.GetPages}`,
};

// -------------------------------------------------------------------------
// Export Store
// -------------------------------------------------------------------------

export const book = {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations,
};

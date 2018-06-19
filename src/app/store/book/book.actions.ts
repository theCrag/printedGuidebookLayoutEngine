import Vue from 'vue';
import { ActionContext, ActionTree } from 'vuex';

import * as cragApi from '@/app/services/api/crag.api';
import * as mutationTypes from './book.mutations.types';
import { BookState } from './book.state';
import { Area } from '@/app/models/Area';
import { AreaLayout } from '@/app/models/AreaLayout';
import { appConfig } from './../../../config/app.config';

const log = Vue.$createLogger('BookActions');

// -------------------------------------------------------------------------
// Define Types & Interfaces
// -------------------------------------------------------------------------

// -------------------------------------------------------------------------
// Define Action Types
// -------------------------------------------------------------------------

export const actionTypes = {
  FETCH_AREA: 'FETCH_AREA',
  ADD_CONTENT: 'ADD_CONTENT',
  BUILD_LAYOUTS: 'BUILD_LAYOUTS',
  GO_TO_NEXT_PAGE: 'GO_TO_NEXT_PAGE',
};

// -------------------------------------------------------------------------
// Define Action Object
// -------------------------------------------------------------------------

export const actions: ActionTree<BookState, BookState> = {

  /**
   *
   */
  [actionTypes.FETCH_AREA]({ commit, dispatch }: ActionContext<BookState, BookState>): void {
    cragApi.fetchArea('')
      .then((area: Area) => {
        commit(mutationTypes.SET_NEW_AREA, area);
        dispatch(actionTypes.BUILD_LAYOUTS, area);
      });
  },

  /**
   *
   */
  [actionTypes.ADD_CONTENT]({ commit, state }: ActionContext<BookState, BookState>, obj: any): void {
    log.info('ADD_CONTENT', obj);
    commit(mutationTypes.ADD_CONTENT, obj);
  },

  /**
   *
   */
  [actionTypes.BUILD_LAYOUTS]({ commit, state }: ActionContext<BookState, BookState>, area: Area): void {
    log.info('BUILD_LAYOUTS', area);
    const layouts = buildAreaLayouts(area);
    commit(mutationTypes.SET_LAYOUTS, layouts);
  },

  /**
   *
   */
  [actionTypes.GO_TO_NEXT_PAGE]({ commit, state }: ActionContext<BookState, BookState>, obj: any): void {
    log.info('GO_TO_NEXT_PAGE', obj);
    const sheets = state.sheets;
    commit(mutationTypes.SET_SHEETS, sheets);
  },
};

/**
 *
 */
const buildAreaLayouts = (area: Area) => {
  let images = area.topos ? area.topos : [];
  images = images.filter((image) => image.linked === undefined);

  const variants = parseInt(appConfig.amountCols, 10);
  const results: AreaLayout[] = [];

  const imageCounter = images.map((_) => 0);
  imageCounter[imageCounter.length - 1] = -1;

  do {
    let sumUp = true;
    for (let n = imageCounter.length - 1; n >= 0; n--) {
      if (sumUp) {
        imageCounter[n]++;
        if (imageCounter[n] > variants) {
          imageCounter[n] = 0;
          sumUp = true;
        } else {
          sumUp = false;
        }
      }
    }

    results.push(AreaLayout.build(area.id, images.map((image, index) => ({
      imageId: image.id,
      variant: imageCounter[index],
    }))));
  } while (imageCounter.some((i) => i < variants));

  return results.map((areaLayout) => {
    areaLayout.subAreas = area.subAreas.map((subArea) => buildAreaLayouts(subArea));
    return areaLayout;
  });
};

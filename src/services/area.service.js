import * as jsonData from '../data/umbrio.json';
// import * as jsonData from '../data/central-park.json';
// import * as jsonData from '../data/central-park-longDesc.json';
import { Area } from '../models/area.model';

/**
 * @name rootArea
 * @description
 * The root area is the last fetched area.
 */
let rootArea;

/**
 * Fetches the information about an area.
 *
 * @returns {Area} Returns the stored rootArea.
 */
export const getRootArea = () => rootArea;

/**
 * Fetches the information about an area from the guide page of the crag
 * webpage. Moreover it fetches further information like the html description.
 *
 * @param {Function} done Callback function witch returns the mapped Area.
 */
export const fetchArea = (done) => {
  rootArea = new Area(jsonData.data);

  doFetchAreaDescription(rootArea, () => {
    done(getRootArea());
  });
}

/**
 * Fetches the html descriptions of the given area.
 *
 * @param {Area} area
 * @param {Function} done Callback function.
 */
export const doFetchAreaDescription = (area, done) => {
  if (area) {
    if (area.fetched) {
      return doFetchAreaDescription(area.fetchNext(), done);
    }
    return area.fetchDescription(() => {
      doFetchAreaDescription(area.fetchNext(), done);
    });
  }
  done();
};

import { Area } from '../models/area.model';
import { getArea } from '../services/api.service';

/**
 * Fetches the information about an area from the guide page of the crag
 * webpage. Moreover it fetches further information like the html description.
 *
 * @param {Function} done Callback function witch returns the mapped Area.
 */
export const fetchArea = (done) => {
  getArea(window.location.pathname, (jsonData) => {
    const rootArea = new Area(jsonData.data);

    doFetchAreaDescription(rootArea, () => {
      done(rootArea);
    });
  });
};

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

import * as jsonData from '../data/umbrio.json';
// import * as jsonData from '../data/central-park.json';
// import * as jsonData from '../data/central-park-longDesc.json';
import { Area } from '../models/area.model';

let rootArea;

export const fetchArea = (done) => {
  rootArea = new Area(jsonData.data);

  doFetchAreaDescription(rootArea, () => {
    done(getRootArea());
  })
}

export const getRootArea = () => rootArea;

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

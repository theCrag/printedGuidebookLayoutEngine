import * as jsonData from '../data/umbrio.json';
// import * as jsonData from '../data/central-park.json';
import { Area } from '../models/area.model';

let rootArea;

export const fetchArea = () => {
  rootArea = new Area(jsonData.data);
  return getRootArea();
}

export const getRootArea = () => rootArea;

// import * as jsonData from '../data/umbrio.json';
import * as jsonData from '../data/central-park.json';
// import * as jsonData from '../data/central-park-longDesc.json';
import { Area } from '../models/area.model';
import $ from "jquery";

let rootArea;

export const fetchArea = () => {
  rootArea = new Area(jsonData.data);
  return getRootArea();
}

export const getRootArea = () => rootArea;

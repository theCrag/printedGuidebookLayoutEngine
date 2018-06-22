import * as jsonData from '../data/umbrio.json';
import { Area } from '../models/area.model';

let rootArea;

export const fetchArea = () => {
  rootArea = new Area(jsonData.data);
  return getRootArea();
}

export const getRootArea = () => rootArea;

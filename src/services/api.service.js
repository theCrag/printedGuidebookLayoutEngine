import $ from "jquery";
import { createLogger } from '../utils/logger';

const log = createLogger('api');

export const getPhoto = (areaId, done) => {
  $.getJSON(`${process.env.API_BASE_URL}/area/${areaId}/photos/json?key=${process.env.API_KEY}`,
    (data) => {
      const photos = [];
      data.data.photos.forEach(element => photos.push(element));
      done(photos);
    })
    .fail(() => {
      log.error('could not get photos for area', areaId);
    });
}

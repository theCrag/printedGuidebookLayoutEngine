import $ from "jquery";
import { createLogger } from '../utils/logger';
import * as jsonData from '../data/description.json';

const log = createLogger('api');

export const getPhotos = (areaId, done) => {
  $.getJSON(`${process.env.API_BASE_URL}/area/${areaId}/photos/json?key=${process.env.API_KEY}`,
    (jsonData) => {
      const photos = [];
      jsonData.data.photos.forEach(element => photos.push(element));
      done(photos);
    })
    .fail(() => {
      log.error('could not get photos for area', areaId);
    });
}

export const getImageUrl = (img) => {
  return (img.hashID) ? `${process.env.API_IMAGE_BASE_URL}/original-image/${img.hashID.substring(0, 2)}/${img.hashID.substring(2, 4)}/${img.hashID}` : undefined;
}

export const getDescriptionHtml = (area, done) => {
  if(process.env.APP_TEST){
    done(jsonData.data);
  } else {
    $.getJSON(`${process.env.API_BASE_URL}/api/area/id/${area.id}/beta?markupType=html&key=${process.env.API_KEY}`,
    (jsonData) => done(jsonData.data))
    .fail(() => {
      log.error('could not get photos for area', areaId);
    });
  }
}
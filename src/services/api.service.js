import $ from 'jquery';
import { createLogger } from '../utils/logger';
import * as jsonData from '../data/description.json';
import * as adJsonData from '../data/ads.json';

const log = createLogger('api');

/**
 * Builds the URL for a given image. With this URL we can display crag images
 * in our HTML.
 *
 * @param {Object} img
 * @returns {string} URL to the crag image.
 */
export const buildImageUrl = (img) => {
  return (img.hashID)
    ? `${process.env.API_IMAGE_BASE_URL}/original-image/${img.hashID.substring(0, 2)}/${img.hashID.substring(2, 4)}/${img.hashID}`
    : undefined;
};

/**
 * Fetches the photo information to an area.
 *
 * @param {string} areaId
 * @param {Function} done Callback function.
 */
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
};

/**
 * Fetches all the html of the areas descriptions.
 *
 * @param {Area} area
 * @param {Function} done Callback function.
 */
export const getDescriptionHtml = (area, done) => {
  if (process.env.APP_TEST) {
    done(jsonData.data);
  } else {
    $.getJSON(`${process.env.API_BASE_URL}/api/area/id/${area.id}/beta?markupType=html&key=${process.env.API_KEY}`,
      (jsonData) => done(jsonData.data))
      .fail(() => {
        log.error('could not get photos for area', area.id);
      });
  }
};

/**
 * Fetches the advertisements information.
 *
 * @returns {Array} ads
 */
export const getAds = () => {
  const ads = [];
  adJsonData.advertiser.forEach((ad) => {
    ads.push(ad);
  });
  ads.sort((a, b) => { return b.priority - a.priority; });
  return ads;
};

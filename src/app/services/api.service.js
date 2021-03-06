import $ from 'jquery';
import { createLogger } from '../utils/logger';
import * as adJsonData from '../../data/ads.json';

const log = createLogger('api');

/**
 * Fetches all the information of the given area.
 *
 * @param {string} areaPath
 * @param {Function} done
 */
export const getArea = (areaPath, done) => {
  $.getJSON(`${process.env.API_BASE_URL}/climbing${areaPath}/guide/json?key=${process.env.API_KEY}`,
    (jsonData) => {
      done(jsonData);
    })
    .fail(() => {
      log.error('could not get area', areaPath);
    });
};

/**
 * Builds the URL for a given image. With this URL we can display crag images
 * in our HTML.
 *
 * @param {Object} img
 * @returns {string} URL to the crag image.
 */
export const buildImageUrl = (img) => {
  if (img && img.hashID) {
    return `${process.env.API_IMAGE_BASE_URL}/original-image/${img.hashID.substring(0, 2)}/${img.hashID.substring(2, 4)}/${img.hashID}`;
  } else {
    return '';
  }
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
      if (jsonData.data.numberPhotos > 0) {
        jsonData.data.photos.forEach(element => photos.push(element));
      }
      done(photos);
    })
    .fail(() => {
      log.error('could not get photos for area', areaId);
    });
};

/**
 * Fetches the html of the areas descriptions.
 *
 * @param {Area} area
 * @param {Function} done Callback function.
 */
export const getDescriptionHtml = (area, done) => {
  $.getJSON(`${process.env.API_BASE_URL}/api/area/id/${area.id}/beta?markupType=html&key=${process.env.API_KEY}`,
    (jsonData) => done(jsonData.data))
    .fail(() => {
      log.error('could not get photos for area', area.id);
    });
};

/**
 * Fetches the advertisements information and returns
 * an array with priorities included.
 *
 * @returns {Array} ads
 */
export const getAds = () => {
  const ads = [];
  adJsonData.advertiser.forEach((ad) => {
    ads.push(ad);
  });

  // Make array with priorities
  let keys = [];
  ads.forEach((ad) => {
    for (var i = 0; i < (ad.priority * 100); i++) {
      keys.push(ad);
    }
  });
  return keys;
};

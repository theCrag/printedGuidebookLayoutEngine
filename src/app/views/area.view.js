import path from '../../assets/google-maps.png';
import logoDark from '../../assets/logo-dark.svg';
import { buildImageUrl } from '../services/api.service';


/**
 * HTML for the bolt image which is used in the routes
 */
const boltSvg = '<span class="clip"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 18" width="11" height="18"><path d="m8,17 0,-2 c1,0 2,-1 2,-2 l0,-9 c0,-2 -2,-3 -4,-3 -4,0 -5,3 -5,5 0,1 1,1.5 1.5,1.5 0.5,1.5 0.5,2.5 1,4 C2,13.4 5,15.4 6,15.4 l0,2 z M3,6.4 c0,0 0,-3 3,-3 1,0 2,0 2,2 l0,7 c0,1 -1,1 -2,1 -1,0 -2,-2 -2,-2 l -1,-5" style="fill:currentColor"></path></svg></span>';

/**
 * Creates the html for an area cover page
 *
 * @param {Area} area
 * @returns {string} html
 */
export const cover = (area, photo) => {
  const photoPath = buildImageUrl(photo);

  return `
    <div class="cover area-${area.id}">
      <img class="cover__logo logo" src="${logoDark}" />
      <h1 class="cover__title">${area.name}</h1>
      <h2 class="cover__date">${(new Date()).getDate()}.${(new Date()).getMonth() + 1}.${(new Date()).getFullYear()}</h2>
      <div class="cover__background" style="background-image: url('${photoPath}');" />
    </div>`;
};

/**
 * Creates the html for an area title
 *
 * @param {Area} area
 * @returns {string} html
 */
export const title = (area) => `
  <h1 id="title-${area.id}" class="title area-${area.id}">${area.name}</h1>`;

/**
 * Creates the html for the geometry element. On the current webpage this element
 * is a google map integration.
 * TODO: Insert real google maps element, currently a default image is used.
 *
 * @param {Area} area
 * @returns {string} html
 */
export const geometry = (area) => `
  <div id="geometry-${area.id}" class="geometry area-${area.id} ${area.descriptions.length === 0 ? 'geometry--wide' : 'geometry--right'}">
    <img src="${path}" />
  </div>`;


/**
 * Creates the html for a collected photo of the crag API
 * to eliminate a widow.
 *
 * @param {number} areaId
 * @param {number} index
 * @param {string} photoPath
 * @returns {string} html
 */
export const widowPhoto = (areaId, index, photoPath) => `
  <div id="photo-${areaId}-${index}" class="photo area-${areaId}">
    <img src="${photoPath}" id="photo-img-${areaId}-${index}" />
  </div>`;

/**
 * Creates the html for a collected photo of the crag API
 * which can have full page width.
 *
 * @param {number} areaId
 * @param {number} index
 * @param {string} photoPath
 * @returns {string} html
 */
export const photo = (areaId, index, photoPath) => `
  <div id="photo-${areaId}-${index}" class="photo-full area-${areaId}">
    <img src="${photoPath}" id="photo-img-${areaId}-${index}" />
  </div>`;

/**
 * Creates the html for a collected photo of the crag API
 * which can have half page width.
 *
 * @param {number} areaId
 * @param {number} index
 * @param {string} photoPath
 * @returns {string} html
 */
export const photoTwo = (areaId, index, photoPath) => `
<div id="photo-${areaId}-${index}" class="photo-two area-${areaId}">
  <img src="${photoPath}" id="photo-img-${areaId}-${index}" />
</div>`;

/**
 * Creates the html for the area description.
 *
 * @param {Area} area
 * @param {number} index
 * @returns {string} html
 */
export const description = (area, index) => `
  <div id="description-${area.id}-${index}" class="description area-${area.id}">
    <h2>${area.descriptions[index].name}</h2>
    <p>${area.descriptions[index].markdown}</p>
  </div>`;

/**
 * Creates the html for the area description without any content.
 * This is used to split the content of a description.
 *
 * @param {string} areaId
 * @param {number} index
 * @returns {string} html
 */
export const emptyDescription = (areaId, index) => `
  <div id="description-${areaId}-${index}" class="description area-${areaId}">
  </div>`;

/**
 * Creates the html for a topo image.
 *
 * @param {Topo} topo
 * @param {string} areaId
 * @returns {string} html
 */
export const topo = (topo, areaId) => `
  <div
    id="topo-${topo.id}"
    class="topo area-${areaId} topo--${topo.orientation === 0 ? 'landscape' : 'portrait'} topo--${topo.imageStyle === 0 ? 'full-page' : (topo.imageStyle === 1) ? 'full-width' : 'col-width'}">
    <img src="${topo.url}" />
  </div>`;

/**
 * Creates a html container for upcoming routes.
 *
 * @param {string} areaId
 * @param {number} index
 * @param {number} colAmount
 * @returns {string} html
 */
export const routesContainer = (areaId, index, colAmount) => `
  <div class="routes routes-${index} area-${areaId}">
    <div class="routes__topo"></div>
    <div class="routes__columns routes__columns--${colAmount}"></div>
  </div>`;

/**
 * Creates a html container for white spaces.
 *
 * @param {number} pageNumber
 * @returns {string} html
 */
export const whitespaceContainer = (pageNumber) => `
<div class="whitespace whitespace__container" id="whitespace-${pageNumber}">
</div>`;

/**
 * Creates the html for a collected advertisement of the crag API.
 *
 * @param {Object} element
 * @param {string} photoPath
 * @param {number} maxHeight
 * @param {string} hashID
 * @returns {string} html
 */
export const advertisement = (element, photoPath, maxHeight, hashID) => `
  <div id="advertisement-${element.id}" page="${element.page}" class="advertisement" hashID="${hashID}" style="height: ${maxHeight}px;">
    <img src="${photoPath}" id="advertisement-img-${element.id}" style="max-height: ${maxHeight}px;" />
  </div>`;

/**
 * Creates the html for a collected advertisement of the crag API
 * which can be used in columns.
 *
 * @param {Object} element
 * @param {string} photoPath
 * @param {number} maxHeight
 * @param {string} hashID
 * @returns {string} html
 */
export const advertisementColumn = (element, photoPath, maxHeight, hashID) => `
<div id="advertisement-${element.id}" page="${element.page}" class="column-advertisement" hashID="${hashID}" style="max-height: ${maxHeight}px;">
  <img src="${photoPath}" id="advertisement-img-${element.id}" style="max-height: ${maxHeight}px;" />
</div>`;

/**
 * Creates the html for a collected advertisement with float right of the crag API.
 *
 * @param {Object} element
 * @param {string} photoPath
 * @param {number} maxHeight
 * @param {string} hashID
 * @returns {string} html
 */
export const advertisementRight = (element, photoPath, maxHeight, hashID) => `
<div id="advertisement-${element.id}-right" page="${element.page}" class="advertisement advertisement-two advertisement-right" hashID="${hashID}" style="height: ${maxHeight}px;">
  <img src="${photoPath}" id="advertisement-img-${element.id}-right" style="max-height: ${maxHeight}px;" />
</div>`;

/**
 * Creates the route html and detects if it is a topo or just a route element.
 *
 * @param {Object{Route or Topo}} routeItem
 * @param {string} areaId
 * @param {number} index
 * @returns {string} html
 */
export const routeItem = (routeItem, areaId, index) =>
  (routeItem.type === 'Topo')
    ? `<div class="route route--blank"></div><div id="route-${areaId}-${index}" class="route route__topo">${topo(routeItem, areaId, index)}</div><div class="route route--blank"></div>`
    : `<div id="route-${areaId}-${routeItem.index}" class="route route__description">
      <div class="route__container">
        <div class="route__header">
          <table class="route__header__container">
            <tr>
              <td class="route__header__container--number">
                <div class="route__header__number">
                  ${routeItem.index}
                </div>
              </td>
              <td class="route__header__container--name">
                <div class="route__header__name">
                  ${routeItem.name}
                </div>
              </td>
              <td class="route__header__container--extras">
                <div class="route__header__extras">
                  ${routeItem.grade ? `
                  <div class="route__header__grade route__header__grade--${parseInt(routeItem.grade) < 7 ? 'gb2' : parseInt(routeItem.grade) > 7 ? 'gb4' : 'gb3'}">
                    ${routeItem.grade}
                  </div>
                  `: ''}
                  ${routeItem.style ? `
                  <div class="route__header__style">
                    ${routeItem.style}
                  </div>
                  `: ''}
                  <div class="route__header__distance">
                  ${routeItem.bolts ? boltSvg : ''}
                    ${routeItem.bolts ? routeItem.bolts : ''}
                    ${routeItem.displayHeight && routeItem.bolts ? ',' : ''}
                    ${routeItem.displayHeight ? routeItem.displayHeight : ''}
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
        ${routeDescription(routeItem)}
      </div>
    </div>
    <div class="route route--blank"></div>`;

/**
 * Builds the HTML for the routes body
 *
 * @param {Object{Route or Topo}} routeItem
 * @returns {String} html
 */
export const routeDescription = (routeItem) => {
  let descriptionsTemplate = '';

  if (routeItem.descriptions.length > 0) {
    const descriptions = routeItem.descriptions.filter(d => !d.isInherited);
    descriptionsTemplate = descriptions.map(d => d.markdown).join('<br/>');
  }

  return `<div class="route__body">${descriptionsTemplate}</div>`;
};

/**
 * Creates an empty route html. This template is used for the
 * route text breaking.
 *
 * @param {Object{Route or Topo}} routeItem
 * @param {String} areaId
 * @param {String} body
 * @returns {String} html
 */
export const emptyRouteItem = (routeItem, areaId, body) =>
  `<div id="route-${areaId}-${routeItem.index}" class="route route__description">
      <div class="route__container">
        <div class="route__body">
          ${body}
        </div>
      </div>
    </div>
    <div class="route route--blank"></div>`;

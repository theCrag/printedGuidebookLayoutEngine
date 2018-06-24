import { times } from 'lodash';
import path from '../assets/pineapple.jpg';

export const title = (area) => `
  <h1 class="title">${area.name}</h1>`;

export const geometry = (area) => `
  <div id="geometry-${area.id}" class="geometry">
    <img
      src="${path}"
      alt="Pineapple"
      style="width:340px;height:340px;margin-left:15px;" />
  </div>`;

export const description = (description) => `
  <div class="description">
    <h2>${description.name}</h2>
    <p>${description.markdown}</p>
  </div>`;

export const topo = (topo) => `
  <div class="topo">
    <img
      src="${topo.url}"
      alt="Topo"
      style="width:100%;" />
  </div>`;

export const routesContainer = (colAmount) => `
  <div class="routes">
    <div class="routes__topo"></div>
    <div class="routes__columns routes__columns--${colAmount}"></div>
  </div>`;

export const routeItem = (routeItem) =>
  (routeItem.type === 'Topo')
    ? `<div class="route">${topo(routeItem)}</div><div class="route route--blank"></div>`
    : `<div class="route">
      <div class="route__container">
        <div class="route__header">
          <div class="route__header__number">
            ${routeItem.index + 1}
          </div>
          <div class="route__header__name">
            ${routeItem.name}
          </div>
          <div class="route__header__grade">
            ${routeItem.grade}
          </div>
          <div class="route__header__style">
            ${routeItem.style}
          </div>
        </div>
        <div class="route__body">
          ${routeItem.descriptions.map(d => d.markdown).join('<br/>')}
        </div>
      </div>
    </div>`;

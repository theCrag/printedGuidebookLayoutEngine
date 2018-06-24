import path from '../assets/pineapple.jpg';

export const title = (area) => `
  <h1 id="title-${area.id}" class="title">${area.name}</h1>`;

export const geometry = (area) => `
  <div id="geometry-${area.id}" class="geometry ${area.descriptions.length === 0 ? 'geometry--wide' : 'geometry--right'}">
    <img
      src="${path}"
      alt="Pineapple" />
  </div>`;

export const description = (description, areaId, index) => `
  <div id="description-${areaId}-${index}" class="description">
    <h2>${description.name}</h2>
    <p>${description.markdown}</p>
  </div>`;

export const topo = (topo, areaId, index) => `
  <div id="topo-${areaId}-${index}" class="topo">
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

export const routeItem = (routeItem, areaId, index) =>
  (routeItem.type === 'Topo')
    ? `<div id="route-${areaId}-${index}" class="route">${topo(routeItem, areaId, index)}</div><div class="route route--blank"></div>`
    : `<div id="route-${areaId}-${index}" class="route">
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

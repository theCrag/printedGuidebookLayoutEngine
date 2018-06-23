import { times } from 'lodash';

export const title = (area) => `
  <h1 class="title">${area.name}</h1>`;

export const geometry = (area) => `
  <div id="geometry-${area.id}" class="geometry">
    <img
      src="https://www.w3schools.com/css/pineapple.jpg"
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

export const routesContainer = (area, colAmount) => `
  <div id="routes-${area.id}" class="routes">
    <div class="routes__topo"></div>
    <div class="routes__columns routes__columns--2">
      ${times(colAmount, () => `<div class="routes-column"></div>`).join('')}
    </div>
  </div>`;

export const routeItem = (routeItem) => (routeItem.type === 'Topo')
  ? topo(routeItem)
  : `<p>
      <b>${routeItem.name}</b><br/>
      ${routeItem.descriptions.map(d => d.markdown).join('<br/>')}
  </p>`;

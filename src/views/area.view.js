import path from '../assets/pineapple.jpg';

export const title = (area) => `
  <h1 id="title-${area.id}" class="title">${area.name}</h1>`;

export const geometry = (area) => `
  <div id="geometry-${area.id}" class="geometry ${area.descriptions.length === 0 ? '' : 'geometry--right'}">
    <img
      src="${path}"
      alt="Pineapple"
      style="width:340px;height:340px" />
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

export const routesContainer = (areaId, colAmount) => `
  <div class="routes routes--${areaId}">
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
          <div class="route__header__extras">
            ${routeItem.grade ? `
            <div class="route__header__grade">
              ${routeItem.grade}
            </div>
            `: ''}
            ${routeItem.style ? `
            <div class="route__header__style">
              ${routeItem.style}
            </div>
            `: ''}
            <div class="route__header__distance">
            ${routeItem.bolts ? `<span class="clip"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 18" width="11" height="18"><path d="m8,17 0,-2 c1,0 2,-1 2,-2 l0,-9 c0,-2 -2,-3 -4,-3 -4,0 -5,3 -5,5 0,1 1,1.5 1.5,1.5 0.5,1.5 0.5,2.5 1,4 C2,13.4 5,15.4 6,15.4 l0,2 z M3,6.4 c0,0 0,-3 3,-3 1,0 2,0 2,2 l0,7 c0,1 -1,1 -2,1 -1,0 -2,-2 -2,-2 l -1,-5" style="fill:currentColor"></path></svg></span>` : ''}
              ${routeItem.bolts ? routeItem.bolts : ''}
              ${routeItem.displayHeight && routeItem.bolts ? ',' : ''}
              ${routeItem.displayHeight ? routeItem.displayHeight : ''}
            </div>
          </div>
        </div>
        <div class="route__body">
          ${routeItem.descriptions.map(d => d.markdown).join('<br/>')}
        </div>
      </div>
    </div>`;

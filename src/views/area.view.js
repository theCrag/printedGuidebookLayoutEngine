export const title = (area) => `<h1 class="title">${area.name}</h1>`;

export const geometry = (area) => `<div id="geometry-${area.id}" class="geometry">
  <img
    src="https://www.w3schools.com/css/pineapple.jpg"
    alt="Pineapple"
    style="width:340px;height:340px;margin-left:15px;" />
</div>`;

export const description = (description) => `<div class="description">
  <h2>${description.name}</h2>
  <p>${description.markdown}</p>
</div>`;

export const topo = (topo) => `<div class="topo">
  <img
    src="${topo.url}"
    alt="Topo"
    style="width:100%;" />
</div>`;

import { Area } from '@/app/models/Area';
import { AreaLayout } from '@/app/models/AreaLayout';
import { appConfig } from '@/config/app.config';

let layouts: AreaLayout[] = [];

export const getLayouts = () => layouts;

export const buildAreaLayouts = (area: Area) => {
  let images = area.topos ? area.topos : [];
  images = images.filter((image) => image.linked === undefined);

  const variants = parseInt(appConfig.amountCols, 10);
  const results: AreaLayout[] = [];

  const imageCounter = images.map((_) => 0);
  imageCounter[imageCounter.length - 1] = -1;

  do {
    let sumUp = true;
    for (let n = imageCounter.length - 1; n >= 0; n--) {
      if (sumUp) {
        imageCounter[n]++;
        if (imageCounter[n] > variants) {
          imageCounter[n] = 0;
          sumUp = true;
        } else {
          sumUp = false;
        }
      }
    }

    results.push(AreaLayout.build(area.id, images.map((image, index) => ({
      imageId: image.id,
      variant: imageCounter[index],
    }))));
  } while (imageCounter.some((i) => i < variants));

  layouts = results.map((areaLayout) => {
    areaLayout.subAreas = area.subAreas.map((subArea) => buildAreaLayouts(subArea));
    return areaLayout;
  });

  return layouts;
};

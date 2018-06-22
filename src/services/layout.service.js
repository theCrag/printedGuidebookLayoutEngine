// import { Layout } from '../models/layout.model';

// const AMOUNT_COLS = 2;

// export const buildAreaLayouts = (area) => {
//   let images = area.topos ? area.topos : [];
//   images = images.filter((image) => image.linked === undefined);

//   const variants = parseInt(AMOUNT_COLS, 10);
//   const layouts = [];

//   const imageCounter = images.map((_) => 0);
//   imageCounter[imageCounter.length - 1] = -1;

//   do {
//     let sumUp = true;
//     for (let n = imageCounter.length - 1; n >= 0; n--) {
//       if (sumUp) {
//         imageCounter[n]++;
//         if (imageCounter[n] > variants) {
//           imageCounter[n] = 0;
//           sumUp = true;
//         } else {
//           sumUp = false;
//         }
//       }
//     }

//     layouts.push(new Layout(images.map((image, index) => ({
//       imageId: image.id,
//       variant: imageCounter[index],
//     }))));
//   } while (imageCounter.some((i) => i < variants));

//   return layouts;
// };

// export const buildAreaLayout = (area) => {

// };

import Vue from 'vue';

import { plainToClass } from 'class-transformer';

import { Area } from '@/app/models/Area';

import * as jsonData from '@/app/services/mock-data/hoz-del-mijares.json';

/**
 * @name getContributors
 * @description Gets all the contributors of this repository.
 * @returns List of contributors.
 */
export async function fetchArea(areaPath: string): Promise<Area> {
  // const response = await Vue.$http.get('/repos/w3tecch/vue-example-app/contributors', {
  //   baseURL: 'https://api.github.com',
  // });

  const response: any = jsonData;
  return plainToClass<Area, Area>(Area, response.data);
}

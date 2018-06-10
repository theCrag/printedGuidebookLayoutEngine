import Vue from 'vue';

import { plainToClass } from 'class-transformer';

import { Area } from '@/app/models/Area';

import * as jsonData from '@/app/services/mock-data/hoz-del-mijares.json';

export async function fetchArea(areaPath: string): Promise<Area> {
  // const response = await Vue.$http.get('/repos/w3tecch/vue-example-app/contributors', {
  //   baseURL: 'https://api.github.com',
  // });

  const response: any = jsonData;
  return plainToClass<Area, Area>(Area, response.data);
}

export function buildImageUrl(hashId: string): string {
  // https://static.thecrag.com/original-image/27/c8/27c80686477bccae3892b189213f5ed4f74ebc4e
  return `https://static.thecrag.com/original-image/${hashId.substring(0, 2)}/${hashId.substring(2, 4)}/${hashId}`;
}

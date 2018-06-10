import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class Geometry {

  @Expose()
  public point: string[];

  @Expose()
  public bbox: string[];

  @Expose()
  public boundary: number[][][];

  @Expose()
  public lat: string;

  @Expose()
  public long: string;

  @Expose()
  public areasize: number;

}

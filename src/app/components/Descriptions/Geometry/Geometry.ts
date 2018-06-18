import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Geometry as GeometryModel } from '@/app/models/Geometry';

@Component
export default class Geometry extends Vue {

  @Prop() public context: GeometryModel;

  private log = Vue.$createLogger('Geometry');

  public mounted(): void {
    this.log.info('onContextChanged', this.context);
  }

}

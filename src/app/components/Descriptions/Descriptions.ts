import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Geometry from '@/app/components/Descriptions/Geometry/Geometry';
import Description from '@/app/components/Descriptions/Description/Description';
import { Description as DescriptionModel } from '@/app/models/Description';
import { Geometry as GeometryModel } from '@/app/models/Geometry';

@Component({
  components: {
    Geometry,
    Description,
  },
})
export default class Descriptions extends Vue {

  @Prop() public context: any;

  public descriptions: DescriptionModel[] = [];
  public geometry: GeometryModel = new GeometryModel();

  private log = Vue.$createLogger('Descriptions');

  public mounted(): void {
    this.log.info('onContextChanged', this.context);
    this.geometry = this.context.value.geometry;
    this.descriptions = this.context.value.descriptions;

    const pathItems = this.context.path.split('.');
    pathItems.pop();
    const path = pathItems.join('.') + '.topos.0';
    const prop = 'topos';

    this.log.info('emit next', prop, path);
    this.$eventBus.$emit('NEXT', { prop, path });
  }

}

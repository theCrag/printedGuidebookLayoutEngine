import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Geometry from '@/app/components/Descriptions/Geometry/Geometry';
import Description from '@/app/components/Descriptions/Description/Description';
import { Description as DescriptionModel } from '@/app/models/Description';
import { Geometry as GeometryModel } from '@/app/models/Geometry';
import { BookActions } from './../../store/book/index';
import { Action } from 'vuex-class';
import { vueIsInsideCurrentSheet } from '@/app/services/utils/page-break.service';

@Component({
  components: {
    Geometry,
    Description,
  },
})
export default class Descriptions extends Vue {

  @Prop() public context: any;

  @Action(BookActions.GoToNextPageDesc)
  public goToNextPageDesc: (type: string) => void;

  public descriptions: DescriptionModel[] = [];
  public geometry: GeometryModel = new GeometryModel();

  private log = Vue.$createLogger('Descriptions');

  public geometryIsReady(): void {
    const geometryElement = $(this.$refs.geometryElement);
    this.log.info('geometryElement', geometryElement);
    if (!vueIsInsideCurrentSheet(geometryElement[geometryElement.length - 1])) {
      return this.goToNextPageDesc('geometry');
    }
  }

  public descriptionIsReady(): void {
    const descriptionElement = $(this.$refs.descriptionElement);
    this.log.info('descriptionElement', descriptionElement);
    for (let i = descriptionElement.length - 1; i >= 0; i--) {
      if (!vueIsInsideCurrentSheet(descriptionElement[i])) {
        return this.goToNextPageDesc('description');
      }
    }
  }

  public mounted(): void {
    this.log.info('onContextChanged', this.context);
    this.geometry = this.context.value.geometry;
    this.descriptions = this.context.value.descriptions;

    const pathItems = this.context.path.split('.');
    pathItems.pop();
    pathItems.push('topos');
    const path = pathItems.join('.') + '.0';
    const prop = 'topos';
    this.log.info('emit next', prop, path);
    this.$eventBus.$emit('NEXT', { prop, path });
  }

}

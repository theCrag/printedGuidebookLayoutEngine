import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Geometry as GeometryModel } from '@/app/models/Geometry';

@Component
export default class Geometry extends Vue {

  @Prop() public context: GeometryModel;

  private log = Vue.$createLogger('Geometry');

  public mounted(): void {
    this.$nextTick(() => {
      // Code that will run only after the
      // entire view has been re-rendered
      this.addGeometry();
    });
  }

  public addGeometry(): void {
    this.log.info('onContextChanged', this.context);

    (this.$refs.element as any).onload = () => {
      this.$emit('is-ready');
    };
  }
}

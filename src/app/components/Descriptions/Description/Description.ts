import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Description as DescriptionModel } from '@/app/models/Description';

@Component
export default class Description extends Vue {

  @Prop() public context: DescriptionModel;

  private log = Vue.$createLogger('Description');

  public mounted(): void {
    this.log.info('onContextChanged', this.context);
  }
}

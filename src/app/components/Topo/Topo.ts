import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { buildImageUrl } from '@/app/services/api/crag.api';

@Component
export default class Topo extends Vue {

  @Prop() public context: any;

  public topoURL: string = '';

  private log = Vue.$createLogger('Topo');

  public mounted(): void {
    this.log.info('onContextChanged', this.context);
    this.topoURL = buildImageUrl(this.context.value.hashID);

    const pathItems = this.context.path.split('.');
    const nextItem = parseInt(pathItems.pop(), 10) + 1;
    const path = pathItems.join('.') + '.' + nextItem;
    const prop = 'topos';

    this.log.info('emit next', prop, path);
    this.$eventBus.$emit('NEXT', { prop, path });
  }

}

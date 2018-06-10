import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Description extends Vue {

  @Prop() public context: any;

  private log = Vue.$createLogger('Description');

  public mounted(): void {
    this.log.info('onContextChanged', this.context);

    const pathItems = this.context.path.split('.');
    const nextItem = parseInt(pathItems.pop(), 10) + 1;
    const prop = 'descriptions';
    const path = pathItems.join('.') + '.' + nextItem;

    this.log.info('emit next', prop, path);
    this.$eventBus.$emit('NEXT', { prop, path });
  }

}

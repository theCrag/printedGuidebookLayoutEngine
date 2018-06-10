import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Title extends Vue {

  @Prop() public context: any;

  private log = Vue.$createLogger('Title');

  public mounted(): void {
    this.log.info('onContextChanged', this.context);

    const pathItems = this.context.path.split('.');
    pathItems.pop();
    pathItems.push('descriptions');
    const prop = 'descriptions';
    const path = pathItems.join('.') + '.0';

    this.log.info('emit next', prop, path);
    this.$eventBus.$emit('NEXT', { prop, path });
  }

}

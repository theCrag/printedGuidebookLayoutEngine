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
    // this.log.info('$refs', this.$refs);
    // const parentSheet = $(this.$refs.element).closest('.sheet');
    // // const sheetOffset = parentSheet.offset() || { top: 0 };
    // const paddingTop = parseFloat(parentSheet.css('padding-top').slice(0,-2));
    // // const paddingBottom = parseFloat(parentSheet.css('padding-bottom').slice(0,-2));
    // const totalPageHeight = paddingTop + ( parentSheet.height() || 0 );
    // // parentSheet.append(`<hr style="position:absolute; top:${totalPageHeight}px; width:100%; border-color: red; margin: 0">`);
    // this.log.info('closest(.sheet)', parentSheet);
    // this.log.info('paddingTop', paddingTop);
    // this.log.info('totalPageHeight', totalPageHeight);

    const pathItems = this.context.path.split('.');
    const nextItem = parseInt(pathItems.pop(), 10) + 1;
    const path = pathItems.join('.') + '.' + nextItem;
    const prop = 'topos';

    this.log.info('emit next', prop, path);
    this.$eventBus.$emit('NEXT', { prop, path });
  }

}

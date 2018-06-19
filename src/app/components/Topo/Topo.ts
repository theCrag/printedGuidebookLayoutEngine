import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { buildImageUrl } from '@/app/services/api/crag.api';
import { BookActions } from './../../store/book/index';
import { Action } from 'vuex-class';

@Component
export default class Topo extends Vue {

  @Action(BookActions.GoToNextPage)
  public goToNextPage: () => void;

  @Prop() public context: any;

  public topoURL: string = '';

  private log = Vue.$createLogger('Topo');

  public mounted(): void {
    this.log.info('mounted');
    this.$nextTick(() => {
      // Code that will run only after the
      // entire view has been re-rendered
      this.log.info('nextTick');
      this.addTopo();
    });
  }

  public addTopo(): void {
      this.log.info('onContextChanged', this.context);
      this.topoURL = buildImageUrl(this.context.value.hashID);
      this.log.info('$refs', this.$refs);
      const element = $(this.$refs.element);

      (this.$refs.element as any).onload = () => {
        const parentSheet = element.closest('.sheet');
        const sheetOffset = parentSheet.offset() || { top: 0 };
        const paddingTop = parseFloat(parentSheet.css('padding-top').slice(0, -2));
        const totalPageHeight = sheetOffset.top + paddingTop + (parentSheet.height() || 0);
        parentSheet.parent().append(`<hr style="position:absolute; top:${totalPageHeight}px; width:100%; border-color: red; margin: 0">`);
        this.log.info('closest(.sheet)', parentSheet);
        this.log.info('paddingTop', paddingTop);
        this.log.info('totalPageHeight', totalPageHeight);
        const elementOffset = element.offset() || { top: 0 };
        const elementBottom = elementOffset.top + (element.height() || 0);
        this.log.info('elementBottom', elementBottom);
        if (elementBottom > totalPageHeight) {
          this.goToNextPage();
        }

        const pathItems = this.context.path.split('.');
        const nextItem = parseInt(pathItems.pop(), 10) + 1;
        const path = pathItems.join('.') + '.' + nextItem;
        const prop = 'topos';

        this.log.info('emit next', prop, path);
        this.$eventBus.$emit('NEXT', { prop, path });
    };
  }

}

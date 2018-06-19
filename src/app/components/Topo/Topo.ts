import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { buildImageUrl } from '@/app/services/api/crag.api';
import { BookActions } from './../../store/book/index';
import { Action } from 'vuex-class';
import { htmlIsInsideCurrentSheet } from '@/app/services/utils/page-break.service';

@Component
export default class Topo extends Vue {

  @Action(BookActions.GoToNextPage)
  public goToNextPage: () => void;

  @Prop() public context: any;

  public topoURL: string = '';

  private log = Vue.$createLogger('Topo');

  public mounted(): void {
    this.$nextTick(() => {
      // Code that will run only after the
      // entire view has been re-rendered
      this.addTopo();
    });
  }

  public addTopo(): void {
      this.log.info('onContextChanged', this.context);
      this.topoURL = buildImageUrl(this.context.value.hashID);
      this.log.info('$refs', this.$refs);
      const element = $(this.$refs.element);
      const that = this;
      (this.$refs.element as any).onload = () => {
        if (!htmlIsInsideCurrentSheet(element)) {
          return this.goToNextPage();
        }

        const pathItems = that.context.path.split('.');
        const nextItem = parseInt(pathItems.pop(), 10) + 1;
        const path = pathItems.join('.') + '.' + nextItem;
        const prop = 'topos';
        that.log.info('emit next', prop, path);
        that.$eventBus.$emit('NEXT', { prop, path });
    };
  }
}

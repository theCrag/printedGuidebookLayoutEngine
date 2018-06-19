import { htmlIsInsideCurrentSheet } from '@/app/services/utils/page-break.service';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { BookActions } from './../../store/book/index';
import { Action } from 'vuex-class';

@Component
export default class Title extends Vue {

  @Action(BookActions.GoToNextPage)
  public goToNextPage: () => void;

  @Prop() public context: any;

  private log = Vue.$createLogger('Title');

  public mounted(): void {
    this.$nextTick(() => {
      // Code that will run only after the
      // entire view has been re-rendered
      this.addTitle();
    });
  }

  public addTitle(): void {
    this.log.info('onContextChanged', this.context);
    this.log.info('$refs', this.$refs);
    const element = $(this.$refs.element);
    if (!htmlIsInsideCurrentSheet(element)) {
      return this.goToNextPage();
    }

    const pathItems = this.context.path.split('.');
    pathItems.pop();
    const prop = 'descriptions';
    const path = pathItems.join('.');
    this.log.info('emit next', prop, path);
    this.$eventBus.$emit('NEXT', { prop, path });
  }
}

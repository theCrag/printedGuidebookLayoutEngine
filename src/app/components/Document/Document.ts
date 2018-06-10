import { BookActions, BookGetters } from './../../store/book/index';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import objectPath from 'object-path';

import Page from '@/app/components/Page/Page';
import { Area } from '@/app/models/Area';
import { Sheet } from '@/app/models/Sheet';

@Component({
  components: {
    Page,
  },
})
export default class Document extends Vue {

  @Action(BookActions.FetchArea)
  public fetchArea: () => void;

  @Action(BookActions.AddContent)
  public addContent: (obj: any) => void;

  @Getter(BookGetters.GetArea)
  public area: Area;

  @Getter(BookGetters.GetPages)
  public sheets: Sheet[];

  private log = Vue.$createLogger('Document');

  public created(): void {
    this.fetchArea();

    this.$eventBus.$on('NEXT', (event: any) => this.onNext(event));
  }

  @Watch('area', { deep: true })
  public areaChanged(): any {
    this.onNext({
      prop: 'title',
      path: 'name',
    });
  }

  public onNext(event: any): void {

    const value = objectPath.get(this.area, event.path);

    this.log.info('onNext', event.prop, event.path, value);

    switch (event.prop) {

      case 'title':
        this.addContent({
          type: 'Title',
          value,
          path: event.path,
        });
        break;

      case 'descriptions':
        if (!value) {
          return;
          // this.onNext({
          //   prop: ,
          //   path: ,
          // });
        }
        this.addContent({
          type: 'Description',
          value,
          path: event.path,
        });
        break;

      default:
        this.log.warn('onNext->NOT_FOUND', event.prop, event.path, value);
    }
  }

}

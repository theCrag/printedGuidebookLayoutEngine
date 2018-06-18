import { BookActions, BookGetters } from './../../store/book/index';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import objectPath from 'object-path';

import Page from '@/app/components/Page/Page';
import { Area } from '@/app/models/Area';
import { Sheet } from '@/app/models/Sheet';
import { AreaLayout } from '@/app/models/AreaLayout';

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

  @Getter(BookGetters.GetLayouts)
  public layouts: AreaLayout[];

  public treePath: number[] = [];

  private log = Vue.$createLogger('Document');

  public created(): void {
    this.fetchArea();

    this.$eventBus.$on('NEXT', (event: any) => this.onNext(event));
  }

  @Watch('layouts')
  public layoutsChanged(): any {
    this.log.info('layoutsChanged', this.layouts);
    this.buildTreePath(this.layouts[0]);
    this.log.info('treePath', this.treePath);

    this.onNext({
      prop: 'title',
      path: 'name',
    });
  }

  private buildTreePath(areaLayout: AreaLayout): void {
    this.treePath.push(0);
    if (areaLayout.subAreas.length > 0) {
      this.buildTreePath(areaLayout.subAreas[0][0]);
    }
  }

  public onNextLayoutTree(): void {
    // TODO: go to the next sibling
    // this.onNext({
    //   prop: 'title',
    //   path: 'name',
    // });
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
        this.addContent({
          type: 'Descriptions',
          value,
          path: event.path,
        });
        break;

      case 'topos':
        if (!value) {
          return;
        }
        this.addContent({
          type: 'Topo',
          value,
          path: event.path,
        });
        break;

      default:
        this.log.warn('onNext->NOT_FOUND', event.prop, event.path, value);
    }
  }

}

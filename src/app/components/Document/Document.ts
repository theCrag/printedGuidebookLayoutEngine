import { AreaActions, AreaGetters } from './../../store/area/index';
import { at, first } from 'lodash';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import objectPath from 'object-path';

import { BookActions, BookGetters } from '@/app/store/book/index';
import Page from '@/app/components/Page/Page';
import { Area } from '@/app/models/Area';
import { Sheet } from '@/app/models/Sheet';
import { AreaLayout } from '@/app/models/AreaLayout';
import { getLayouts } from '@/app/services/utils/layout.service';

@Component({
  components: {
    Page,
  },
})
export default class Document extends Vue {

  @Action(AreaActions.FetchArea)
  public fetchArea: () => void;

  @Action(BookActions.AddContent)
  public addContent: (obj: any) => void;

  @Getter(AreaGetters.GetArea)
  public area: Area;

  @Getter(BookGetters.GetPages)
  public sheets: Sheet[];

  @Getter(BookGetters.GetPageSize)
  public sheetsSize: number;

  @Getter(AreaGetters.HasInitialized)
  public hasInitialized: boolean;

  // public layouts: AreaLayout[];
  public treePath: number[] = [];

  private log = Vue.$createLogger('Document');

  public created(): void {
    this.fetchArea();

    this.$eventBus.$on('NEXT', (event: any) => this.onNext(event));
  }

  @Watch('hasInitialized')
  public layoutsChanged(): any {
    if (this.hasInitialized) {
      this.log.info('layouts are builded');
      this.buildTreePath(getLayouts()[0]);
      this.log.info('treePath', this.treePath);

      this.onNext({
        prop: 'title',
        path: 'name',
      });
    }
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

    this.log.info('onNext event', event.prop, event.path);
    // const value = objectPath.get(this.area, event.path);
    let value: any = this.area;
    if (event.path !== '') {
      value = first(at(this.area, event.path));
    }

    this.log.info('onNext value', value);

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

import { BookGetters } from '@/app/store/book/index';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { Sheet } from '@/app/models/Sheet';
import Title from '@/app/components/Title/Title';
import Descriptions from '@/app/components/Descriptions/Descriptions';
import Topo from '@/app/components/Topo/Topo';
import { Action, Getter } from 'vuex-class';
import { BookActions } from '@/app/store/book';

@Component({
  components: {
    Title,
    Descriptions,
    Topo,
  },
})
export default class Page extends Vue {

  @Prop() public sheetId: number;

  @Getter(BookGetters.GetPageById)
  public getPageById: (id: number) => Sheet;

  public sheet: Sheet = new Sheet(0);

  private log = Vue.$createLogger('Page');

  public mounted(): void {
    this.log.info('mounted', this.sheetId);
    this.sheet = this.getPageById(this.sheetId);
  }

}

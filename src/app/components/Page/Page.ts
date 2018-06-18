import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { Sheet } from '@/app/models/Sheet';
import Title from '@/app/components/Title/Title';
import Descriptions from '@/app/components/Descriptions/Descriptions';
import Topo from '@/app/components/Topo/Topo';

@Component({
  components: {
    Title,
    Descriptions,
    Topo,
  },
})
export default class Page extends Vue {

  @Prop() public sheet: Sheet;

  private log = Vue.$createLogger('Page');

  @Watch('sheet', {
    deep: true,
  })
  public sheetChanged(): void {
    this.log.info('sheetChanged', this.sheet.id, this.sheet);
  }

}

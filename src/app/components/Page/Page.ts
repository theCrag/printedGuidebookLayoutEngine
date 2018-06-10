import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { Sheet } from '@/app/models/Sheet';
import Title from '@/app/components/Title/Title';
import Description from '@/app/components/Description/Description';

@Component({
  components: {
    Title,
    Description,
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

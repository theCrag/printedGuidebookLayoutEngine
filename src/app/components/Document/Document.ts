import { BookActions } from './../../store/book/index';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';

import Page from '@/app/components/Page/Page';

@Component({
  components: {
    Page,
  },
})
export default class Document extends Vue {

  @Action(BookActions.FetchArea)
  public fetchArea: () => void;

  public created(): void {
    this.fetchArea();
  }

}

import { Component, Prop, Vue } from 'vue-property-decorator';

import Page from '@/app/components/Page/Page';

@Component({
  components: {
    Page,
  },
})
export default class Document extends Vue { }

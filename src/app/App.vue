<template>
  <Document />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import Document from '@/app/components/Document/Document';

@Component({
  components: {
    Document,
  },
})
export default class App extends Vue { }
</script>

<template>
  <Main />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import Main from '@/app/components/Main/Main';

@Component({
  components: {
    Main,
  },
})
export default class App extends Vue { }
</script>

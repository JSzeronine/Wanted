<template>
  <div id="app" ondragstart="return false">
    <router-view/>
  </div>
</template>

<script>
import store from '@/vuex/Store'
export default {
  name: 'App',
  store
}

</script>

<style lang="scss">
  *{ font-size: 0; margin: 0; padding: 0; box-sizing: border-box; }
  body{ width: 100%; overflow: hidden; background-color: #fafafa; }

</style>
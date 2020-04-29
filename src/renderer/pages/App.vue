<template>
  <div id="app">
    <!-- <p class="path">{{$route.fullPath }}</p> -->
    <!-- <button class="btn-home-page" @click="$router.push('/landing')">root页</button> -->
    <!-- <button class="btn-home-page" @click="$router.push('/')">home页</button> -->

    <!-- <hr> -->

    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'vue-electron',
    created(){
      window.$router = this.$router

      document.addEventListener('drop', e => e.preventDefault())
      document.addEventListener('dragover', e => e.preventDefault())
    },

  }
</script>

<style lang="scss">
/* @import '~@/style/index.scss': css, img.src 等文件中的绝对路径写法 */
@import '~@/style/index.scss';



hr{
  margin: 0.5em;
}
</style>

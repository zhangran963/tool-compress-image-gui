<template>
  <div id="app">
    <p class="path">{{$route.fullPath }}</p>
    <!-- <button class="btn-home-page" @click="$router.push('/landing')">root页</button> -->
    <!-- <button class="btn-home-page" @click="$router.push('/')">home页</button> -->

    <hr>

    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'vue-electron',
    created(){
      window.$router = this.$router
      // console.log('* created', this.$route)
    }
  }
</script>

<style lang="scss">
/* @import '~@/style/index.scss': css, img.src 等文件中的绝对路径写法 */
@import '~@/style/index.scss';
@import '~@/style/global.scss';

.path{
  padding: 0.3em 0 0.6em;
}

hr{
  margin: 0.5em;
}

.btn-home-page{
  padding: 1em 2em;
  background-color: darkcyan;
  color: lightyellow;
  font-size: 16px;
  outline: none;
  border: none;
  border-radius: 0.16em;
  cursor: pointer;
}
</style>

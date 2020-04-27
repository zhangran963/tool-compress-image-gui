<template>
	<div class="drag-container">
		<com-drag-box @change="(validFile) => {this.file = validFile}"></com-drag-box>

    <div class="btn-box" v-if="file && file.isValid">
      <button class="btn start" v-if="status === null" @click="compressHandler">开始压缩</button>
      <button class="btn compressing" v-if="status === true">压缩中...</button>
      <button class="btn error" v-if="status === false" @click="resetHandler">恢复</button>
    </div>
	</div>
</template>

<script>
const compress = require('./node-compress/index')
import ComDragBox from './drag-box';


export default {
	components: { ComDragBox },
	data: () => ({
    file: null,
    status: null, /* 未压缩: null; 压缩中: true; 压缩出错: false */
  }),
  watch: {
    file(curr){
      console.log('* 父组件接收: ', curr)
    }
  },
  methods: {
    /* 压缩 */
    compressHandler(){
      this.status = true
      compress(this.file.path).then(res => {
        console.log('* 压缩结果', res)

        /* 恢复状态 */
        this.status = null
      }).catch(err => {
        console.log('* err', err)
        this.status = false
      })
    },

    /* 重置 */
    resetHandler(){
      this.file = null
      this.status = null
    },

  }
};
</script>


<style lang="scss" scoped>
.drag-container {
  .btn-box{
    .btn{
      padding: 16px 24px;
      border: none;
      outline: none;
      background-color: green;
      border-radius: 2px;
      font-size: 20px;
      color: white;
    }
  }
}
</style>
<template>
	<div class="drag-container">
		<com-drag-box @change="(validFile) => {this.file = validFile}"></com-drag-box>

    <div class="btn-box" v-if="file && file.isValid">
      <van-button type="primary" v-if="status === null" @click="compressHandler">开始压缩</van-button>
      <van-button type="primary" v-if="status === true" :disabled="true">压缩中...</van-button>
      <van-button type="warning" v-if="status === false" @click="resetHandler">重置</van-button>
    </div>
	</div>
</template>

<script>
const compress = require('./node-compress/index')
import ComDragBox from './drag-box';
import { clipboard } from "electron";

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
  mounted(){
    // let s = this.$notify({
    //   message: '提示文案',
    //   duration: 5000,
    //   color: '#ad0000',
    //   background: '#ffe1e1'
    // })
    this.$notify.warning('嘿嘿')
    // this.$notify('提示文本').then(res => console.log(res))
  },
  methods: {
    /* 压缩 */
    compressHandler(){
      this.status = true
      compress(this.file.path).then(res => {
        console.log('* 压缩结果', res)

        /* 剪切板 */
        clipboard.writeText(`压缩结果地址: ${res.outputFullname}`)

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

      &.compressing{
        opacity: 0.5;
      }
    }
  }
}
</style>
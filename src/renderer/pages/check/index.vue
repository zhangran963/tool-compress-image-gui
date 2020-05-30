<template>
  <van-popup class="page-check" v-model="show" :close-on-click-overlay="false">
    <span>初始化...</span>
  </van-popup>
</template>

<script>
import { store } from '../../common/utils';
import { getTinify, getCompressionCount } from '../compress/node-compress/Tinify';


const checkReg = /^[\da-z]{32}$/gi;
export default {
	data() {
		return {
      show: true,
			apiKey: store.get('apiKey'),
		};
	},
	computed: {
		/* apiKey格式是否正确 */
		validApiKey() {
			const key = this.apiKey;
			return typeof key === 'string' && key.length === 32 && checkReg.test(key);
		},
	},
	created() {
    /* 格式 */
		if (!this.validApiKey) {
      this.$notify.warning(`请配置apiKey`, 4500).then(_ =>{
        this.$router.replace('/config');
      });
		}
    /* 实例化 */
		const Tinify = getTinify();
		if (!Tinify) {
			this.$notify.warning(`请配置apiKey`, 4500).then(_ =>{
        this.$router.replace('/config');
      });
		} else {
      /* 有效期 */
			getCompressionCount().then((usedNum) => {
				if (usedNum <= 495) {
					this.$router.replace('/compress');
				} else {
          this.$notify.warning(`剩余压缩次数 ${500 - usedNum}次，请更换新的apiKey`, 4500).then(_ =>{
					  this.$router.replace('/config');
          });
				}
			}).catch(({status, message}) => {
        this.$notify.error(`${status} ${message}`, 4500).then(_ =>{
          this.$router.replace('/config');
        })
      })
		}
	},
};
</script>

<style lang="scss" scoped>
@import "~@/style/index.scss";

.page-check{
  color: white;
}
</style>

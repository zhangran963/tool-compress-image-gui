<template>
	<div class="page-compress">
		<!-- api状态 -->
		<com-key-status></com-key-status>

		<!-- 操作模式 -->
		<com-type></com-type>

		<!-- 主体/进度 区 -->
		<com-body-path class="com-body" v-if="modeIndex === 0"></com-body-path>
		<com-body-base64 class="com-body" v-else></com-body-base64>
	</div>
</template>

<script>
import ComKeyStatus from './com-key-status';
import ComType from './com-type';
import ComBodyPath from './com-body-path/index';
import ComBodyBase64 from './com-body-base64/index';

import { store, isDefNum } from '../../common/utils';

export default {
	components: { ComKeyStatus, ComType, ComBodyPath, ComBodyBase64 },
	data: () => ({
		modeIndex: store.get('modeIndex'),
	}),
	created() {
		/* 监听 */
		store.listenModeIndex((curr, prev) => {
			isDefNum(curr) && (this.modeIndex = curr);
		});
	},
  methods: {},
  beforeDestroy(){
    store.listenModeIndex.unSubscribe()
  }
};
</script>

<style lang="scss" scoped>
@import '~@/style/index.scss';

.page-compress {
  width: 100vw;
  min-width: 600px;
  height: 100vh;
  min-height: 500px;
  overflow: auto;
  
	padding: 30px 0 0;
	user-select: none;
  cursor: default;
  @include flex-col(space-between, stretch);

	.com-body {
    flex: 1;
    border: 1px dashed $blue;
    border-radius: 2px;
    width: calc(100% - 10px);
    margin: 5px auto;
	}
}
</style>

<template>
	<div class="status-animation">
    <!-- 等待 -->
    <div class="circle-box start" v-if="status === 1"></div>

    <!-- 压缩中 -->
		<div class="circle-box process" v-else-if="status === 2">
			<div class="circle"></div>
			<div class="circle"></div>
		</div>

    <!-- 压缩完成 -->
    <div class="circle-box end" v-else-if="status === 3">
			
		</div>

    <!-- 出错 -->
    <div class="circle-box error" v-else-if="status === 0">
			错误
		</div>
	</div>
</template>

<script>
export default {
  props: ['status'],
  data(){
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import "~@/style/index.scss";

.status-animation {
	width: 42px;
	height: 42px;
  // outline: 1px solid;
  @include flex-row(center, center);

	.circle-box {
    width: 30px;
    height: 30px;
    // animation: rotateEle 3s linear infinite;

    position: relative;
		.circle {
      position: absolute;
      left: calc(50% - 8px);
      top: 50%;
      transform: translate(-50%, -50%);

			display: inline-block;
			width: 12px;
			height: 12px;
			border-radius: 50%;
      background-color: $darkBlue;

      animation: scaleEle 3s ease-in-out infinite;
    }
    .circle:nth-child(2){
      left: calc(50% + 8px);
      animation: scaleEle 3s linear -1.5s infinite;
    }
  }
  .circle-box.start{
    @include icon-start;
  }
  .circle-box.process{
    @include icon-process;
  }
  .circle-box.end{
    @include icon-end;
  }
}

@keyframes rotateEle{
  0% {transform: rotate(0);}
  50% {transform: rotate(180deg);}
  100% {transform: rotate(360deg);}
}
@keyframes scaleEle{
  0% {transform: translate(-50%, -50%) scale(0.33);}
  50% {transform: translate(-50%, -50%) scale(1);}
  100% {transform: translate(-50%, -50%) scale(0.33);}
}

</style>

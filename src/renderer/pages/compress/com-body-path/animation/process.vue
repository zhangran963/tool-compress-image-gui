<template>
	<div class="com-animation-process">
		<div class="circle"></div>
		<div class="circle"></div>
		<div class="circle"></div>
	</div>
</template>

<style lang="scss" scoped>
@import "~@/style/index.scss";

@keyframes process {
  0% {transform: scale(1);}
  50% {transform: scale(0.4);}
  100% {transform: scale(1);}
}
.com-animation-process {
  @include flex-row(center, center);
  
  $circleWidth: 14px;
  .circle{
    width: $circleWidth;
    height: $circleWidth;
    margin: 0 0.1*$circleWidth;
    border-radius: 50%;
    background-color: $darkBlue;

    $time: 0.2s;
    animation: process $time*6 ease-in-out 0s infinite alternate;
    &:nth-child(1){
      animation-delay: 0;
    }
    &:nth-child(2){
      animation-delay: $time*1;
    }
    &:nth-child(3){
      animation-delay: $time*2;
    }
  }
}


</style>

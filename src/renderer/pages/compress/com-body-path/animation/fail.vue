<template>
	<div class="com-animation-fail">
	</div>
</template>

<style lang="scss" scoped>
@import "~@/style/index.scss";

@keyframes process {
  0% {transform: scale(1);}
  50% {transform: scale(0.4);}
  100% {transform: scale(1);}
}
.com-animation-fail {
  @include flex-row(center, center);
  
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 3px solid $red;

  position: relative;
  &::before, &::after{
    content: '';
    position: absolute;
    width: 3px;
    height: 3px;
    background-color: $red;
    border-radius: 2px;
    transform: rotate(45deg);
  }
  // 横向
  &::before{
    width: 24px;
  }
  // 纵向
  &::after{
    height: 24px;
  }
}


</style>

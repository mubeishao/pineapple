<template>
  <header class="header">
    <slot class="left clickBtn">
      <img src="../common/images/back1.png"  @click.stop="goback()">
    </slot>
    <span class="header-title">
      <span class="header_title_text">{{title}}</span>
    </span>
    <slot class="right"></slot>
  </header>
</template>
<script>
export default {
  props: {
    title: String,
    isWebView:false//是否关闭当前webview
  },
  data() {
    return {};
  },
  methods: {
    goback() {
       if(this.isWebView){
        plus.screen.unlockOrientation(); // 启用旋转屏幕
        plus.webview.currentWebview().close("zoom-fade-in", 350);
      }else{
        this.$router.go(-1);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.header {
  background: #171723;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: remCalc(120);
  // padding-top: 0.2rem;
  z-index: 9999;
}
.header-title {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  // text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header_title_text {
  display: block;
  font-size: remCalc(40);
  color: #dedede;
  white-space: nowrap;
}

.header img {
  position: absolute;
  top: 60%;
  left: remCalc(32);
  transform: translateY(-50%);
  width: remCalc(50);
  height: remCalc(39);
}
.header img:active {
  transition: 0.3s;
  transform: translateY(-50%) scale(0.9);
}
// @media (min-width: 768px) {
//   .header img {
//     padding-bottom: 0.32rem;
//   }
// }
.headLeft {
  position: absolute;
  top: 50%;
  left: 0.3rem;
  transform: translateY(-50%);
  width: 10%;
  height: 50%;
  background: red;
}
.headLeft img {
  font-size: 0.3rem;
}
</style>
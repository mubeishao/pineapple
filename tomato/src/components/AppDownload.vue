<template>
  <transition name="popup">
    <main v-show="show&&!isApp">
      <img src="~@/common/images/bj.jpg" ref="bg_img">
      <div class="btn_area" ref="btn_area">
        <a v-if="isIOS" :href="iosUrl" class="btn clickBtn">
          <img src="~@/common/images/button01.png">
        </a>
        <a v-else :href="androidUrl" class="btn clickBtn">
          <img src="~@/common/images/button01.png">
        </a>
        <a href="#" class="btn clickBtn" @click.prevent="closeHandler">
          <img src="~@/common/images/button02.png">
        </a>
      </div>
    </main> 
  </transition>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      isApp: isApp,
      isIOS: isIOS,
      isAndroid: isAndroid,
      iosUrl: null,
      androidUrl: null
    };
  },
  mounted() {
    //  console.log(this.show);
    //  console.log(this.isIOS);
    //  console.log(this.isAndroid);
    var dt = new Date();
    var version = "" + dt.getFullYear() + dt.getMonth() + dt.getDate();
    this.iosUrl =
      "itms-services://?action=download-manifest&url=https://h5.aihuicheng.com/resource/client_package/download.plist?" +
      version;
    this.androidUrl =
      "https://h5.aihuicheng.com/resource/client_package/DFQ_Android.apk?" +
      version;

    if (sessionStorage.getItem("showAD") === null) {
      sessionStorage.setItem("showAD", true);
    }
    this.show = JSON.parse(sessionStorage.getItem("showAD"));
    let { bg_img, btn_area } = this.$refs;
    bg_img.onload = () => {
      let bg_width = bg_img.width;
      btn_area.style.width = `${bg_width}px`;
      window.addEventListener("resize", () => {
        btn_area.style.width = `${bg_width}px`;
      });
    };
  },
  methods: {
    closeHandler() {
      sessionStorage.setItem("showAD", false);
      this.show = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.popup-enter {
  transform: scale(0);
}
.popup-enter-active {
  transition: 0.3s;
}
.popup-leave-to {
  transform: scale(1);
}
.popup-leave-active {
  transform: scale(0);
  transition: 0.4s;
}
main {
  height: 100%;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: #061225;
}
img {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: 100%;
  pointer-events: none;
}
.btn_area {
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 5%;
  display: flex;
  justify-content: center;
}

.btn {
  margin: 0 0.2rem;
}
.btn img {
  width: 100%;
}
</style>

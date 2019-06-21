<template>
  <div id="app" ref="mock">
    <audio id="bgmusic" autoplay preload loop controls hidden="true" ref="bgm"></audio>
    <!-- <keep-alive> -->
    <transition :name="transitionName">
      <router-view></router-view>
    </transition>
    <!-- </keep-alive> -->
  </div>
</template>

<script>
import Storage from "@/common/utils/storage";
export default {
  name: "App",
  data() {
    return {
      transitionName: "slide-right"
    };
  },
  watch: {
    $route(to, from) {
      const toName = to.name;
      const toDep = to.path.split("/");
      const fromDep = from.path.split("/");
      if (to.name === "Forgetpwd") {
        this.transitionName = "Slide-horizontal";
        return;
      }
      if (to.name === "Login") {
        this.transitionName = "R-Slide-horizontal";
        return;
      }
    }
  },
  mounted() {
    document.addEventListener("touchstart", function() {},false);
    if (isApp) {
      plus.screen.lockOrientation("portrait-primary"); // 把屏幕方向改变成竖屏正方向
      window.addEventListener(
        "onorientationchange" in window ? "orientationchange" : "resize",
        function() {
          if (window.orientation === 180 || window.orientation === 0) {
            // 设置应用非全屏显示！
            plus.navigator.setFullscreen(true);
            console.log("竖屏了");
          }
          if (window.orientation === 90 || window.orientation === -90) {
            // alert('横屏状态！');
            console.log("横屏了");
            // 设置应用全屏显示！
            plus.navigator.setFullscreen(true);
          }
        },
        false
      );
      //移动端的浏览器一般都支持window.orientation这个参数，通过这个参数可以判断出手机是处在横屏还是竖屏状态。
    }

    // var that = this
    function log(info) {
      // console.log(info);
      // alert(info);
    }
    var audioEl = this.$refs.bgm;
    function forceSafariPlayAudio() {
      audioEl.load();
      Storage.get("isVolume") == true ? audioEl.play() : audioEl.pause();
    }
    audioEl.addEventListener(
      "loadstart",
      function() {
        log("loadstart");
      },
      false
    );
    audioEl.addEventListener(
      "loadeddata",
      function() {
        log("loadeddata");
      },
      false
    );
    audioEl.addEventListener(
      "loadedmetadata",
      function() {
        log("loadedmetadata");
      },
      false
    );
    audioEl.addEventListener(
      "canplay",
      function() {
        log("canplay");
      },
      false
    );
    audioEl.addEventListener(
      "play",
      function() {
        log("play");
        window.removeEventListener("touchstart", forceSafariPlayAudio, false);
      },
      false
    );
    audioEl.addEventListener(
      "playing",
      function() {
        log("playing");
      },
      false
    );
    audioEl.addEventListener(
      "pause",
      function() {
        log("pause");
      },
      false
    );
    window.addEventListener("touchstart", forceSafariPlayAudio, false);
    audioEl.src = require("@/common/music/bgm.mp3");
    Storage.get("isVolume") == true ? audioEl.play() : audioEl.pause();
  }
};
</script>

<style lang="scss" >
/*设置IOS页面长按不可复制粘贴，但是IOS上出现input、textarea不能输入，因此将使用-webkit-user-select:auto;*/  
*{  
    -webkit-touch-callout:none;  /*系统默认菜单被禁用*/  
    -webkit-user-select:none; /*webkit浏览器*/  
    -khtml-user-select:none; /*早期浏览器*/  
    -moz-user-select:none;/*火狐*/  
    -ms-user-select:none; /*IE10*/  
    user-select:none;  
} 
input,textarea {
    -webkit-user-select:auto; /*webkit浏览器*/
    margin: 0px;
    padding: 0px;
    outline: none;
}

*{ -webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-tap-highlight-color: transparent; /* For some Androids */ }

div::-webkit-scrollbar {
  color: #ffffff;
  height: 0;
  width: 0;
  background: none;
}
body {
  font-family: "Microsoft YaHei";
  background-color: #1f212e;
}
#app {
  width: 100%;
  height: 100vh;
  background-color: #1f212e;
}
.mint-toast-text {
  white-space: pre-wrap;
  line-height: 1.5;
}
/* Change Autocomplete styles in Chrome*/
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  border: none;
  -webkit-text-fill-color: #888;
  -webkit-box-shadow: 0 0 0px 1000px rgba(#000, 0) inset;
  transition: background-color 5000s ease-in-out 0s;
}

// 水平滑入滑出
.Slide-horizontal-enter-active {
  position: fixed;
  width: 100%;
  height: 100vh;
  transition: 0.4s;
  z-index: 9999;
  top: 0;
  left: 0%;
  background: #1f212e;
}
.Slide-horizontal-enter {
  left: 100%;
  bottom: 0;
}
.Slide-horizontal-leave-active {
  transition: 0.3s;
}

.R-Slide-horizontal-leave-active {
  transition: left 0.4s;
  left: 0%;
  background: #1f212e;
  width: 100%;
  z-index: 999999;
}
.R-Slide-horizontal-leave-to {
  position: fixed;
  z-index: 9999;
  left: 100%;
  height: 100%;
}
.R-Slide-horizontal-enter-active {
  opacity: 0;
  transition: opacity 0.01s;
}
.clickBtn:active {
  transition: 0.3s;
  transform: scale(0.9);
}
li:active,
img:active,
a:active,
button:active {
  transition: 0.3s;
  transform: scale(0.9);
}
</style>

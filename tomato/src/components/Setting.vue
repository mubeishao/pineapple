<template>
  <transition name="pop">
    <div class="setting">
      <div class="bg" @click.prevent="cancel"></div>
      <section class="container">
        <div class="top">
          <p></p>
        </div>
        <div class="bottom">
          <div class="music">
            <span>音效</span>
            <input type="range" v-model="seVal" :style="'background-position-x:'+sePercent+'rem'">
            <img src="../common/images/icon_music.png">
          </div>
          <div class="music">
            <span>声音</span>
            <input type="range" v-model="sVal" :style="'background-position-x:'+sPercent+'rem'">
            <img src="../common/images/icon_volumn.png">
          </div>
          <a href="#" class="btn-account" @click.prevent="logOut"></a>
        </div>
        <div class="close" @click="close">
          <img src="../common/images/icon_close.png">
        </div>
      </section>
    </div>
  </transition>
</template>

<script>
import Storage from "../common/utils/storage";
export default {
  data() {
    return {
      info: "",
      seVal: 100,
      sVal: Number,
      audio:this.$root.$children[0].$refs.bgm
    };
  },
  props: {
    alertText: String,
    isCancel: {
      type: Boolean,
      default: true
    },
    isInput: {
      type: Boolean,
      default: false
    },
    placeholderText: {
      type: String,
      default: ""
    }
  },
  beforeMount() {
    let val = Storage.get("sVolume");
    if (!Storage.get("sVolume")) {
      Storage.set("sVolume", 100);
      this.sVal = 100;
      return;
    }
    this.sVal = val;
  },
  // mounted() {
  //   console.log(this.sVal);
  // },
  methods: {
    cancel() {
      this.$emit("cancel", false);
    },
    confirm() {
      this.$emit("confirm", this.info);
    },
    logOut() {
      this.$router.push({ name: "Login" });
      Storage.revome("userInfo");
      Storage.revome("token");
      this.$emit("close");
    },
    close() {
      this.$emit("close");
    }
  },
  computed: {
    // 音效
    sePercent() {
      // this.$store.dispatch("syncVolume",  (this.seVal / 100) );
      // var audio = this.$store.state.bgm;
      // audio.volume = (this.seVal / 100) * 3 - 3;
      return (this.seVal / 100) * 3 - 3;
    },
    // 聲音
    sPercent() {
      // let audio =this.$root.$children[0].$refs.bgm
      this.audio.volume = this.sVal / 100 ;
      return (this.sVal / 100) * 3 - 3;
    }
  },
  watch: {
    sVal(val) {
      var audio = this.$store.state.bgm;
      audio.volume = val / 100;
    }
  },
  updated() {
    Storage.set("sVolume", this.sVal);
  }
};
</script>


<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.pop-enter-active {
  transition: 0.3s;
  .container {
    transition: 0.3s;
    transform: translate(-50%, -50%) scale(1);
  }
}

.pop-enter {
  .container {
    transform: translate(-50%, -50%) scale(0);
  }
}

.pop-leave-active {
  transition: 0.3s;

  .container {
    transition: 0.3s;
    transform: translate(-50%, -50%) scale(0);
  }
}
.pop-leave {
  .container {
    transform: translate(-50%, -50%) scale(1);
  }
}
.bg {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #000;
  top: 0;
  left: 0;
  opacity: 0.1;
}
.setting {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 9999;
  .container {
    width: remCalc(614);
    height: 30%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -110%);
    z-index: 100000;
    background: white;
    border-radius: remCalc(25) remCalc(25) 0 0;
    border: 1px solid #aca4d9;
    .top {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      font-size: 0.24rem;
      height: remCalc(130);
      background-color: #ffffff;
      background: url("../common/images/setting_head.png");
      background-size: cover;
      border-radius: remCalc(20) remCalc(20) 0 0;
      .confirm {
        flex: 1;
        height: 0.8rem;
        font-size: 0.3rem;
        color: #0391f2;
        align-content: center;
        line-height: 0.8rem;
      }
    }
    .bottom {
      display: flex;
      flex-direction: column;
      height: remCalc(356);
      width: 100%;
      font-size: 0.3rem;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      background: #dcd8d9;
      .music {
        margin: 0.1rem 0;
        width: 85%;
        span {
          color: #4c46c8;
          font-weight: 500;
        }
        input {
          margin-bottom: 0.4rem;
          margin-right: 0.1rem;
          background: url("../common/images/progress_bar.png");
          background-repeat: no-repeat;
          background-size: 100% 110%;
          background-position-x: -3rem+3rem/100 * 1;
          background-color: #3c3c3c;
          box-shadow: 4px 4px 3px #bfbdbe;
        }
        img {
          height: remCalc(40);
          margin-bottom: remCalc(-7);
          // line-height: remCalc(40);
        }
      }
      .btn-account {
        height: remCalc(81);
        width: remCalc(266);
        background: url("../common/images/button_account.png");
        background-size: cover;
      }
    }
    .close {
      margin-top: remCalc(110);
      text-align: center;
      img {
        height: remCalc(81);
        width: remCalc(81);
      }
    }
  }
}

input[type="range"] {
  -webkit-appearance: none;
  width: 3rem;
  border-radius: 10px;
  /*这个属性设置使填充进度条时的图形为圆角*/
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
}
input[type="range"]::-webkit-slider-runnable-track {
  height: 0.2rem;
  border-radius: 10px;
  border: 1px solid #ffc000;

  // background: url("../common/images/progressBar.png");
  // background-size: cover;
}
input[type="range"]:focus {
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 0.4rem;
  width: 0.4rem;
  margin-top: remCalc(-15);
  // margin-left: 0.1rem;
  /*使滑块超出轨道部分的偏移量相等*/
  border: none;
  border-radius: 50%;
  // box-shadow: 0 0.125em 0.125em #3b4547;
  /*添加底部阴影*/
  background: url("../common/images/icon_dice.png");
  background-size: contain;
  transform: scale(1.3);
}
</style>

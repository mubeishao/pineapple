<template>
  <transition name="pop">
    <div v-show="showTip" class="alert_container">
      <div class="bg" @click.prevent="cancel"></div>
      <section class="tip_text_container">
        <div class="tip_icon">
          <img src="../common/images/alertBJ.png">
        </div>
        <div class="main_container">
          <div class="tip_text">{{alertText}}</div>
          <div class="tip_input" v-if="isInput">
            <input
              type="text"
              name="quantity"
              :placeholder="placeholderText"
              v-model.trim="info"
              :class="{warn:isCheck}"
            >
          </div>
        </div>

        <div class="content">
          <div class="cancel" v-if="isCancel" @click="cancel">取消</div>
          <div class="confrim" @click="confirm">确认</div>
        </div>
      </section>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      info: "",
      isCheck: false
    };
  },
  props: {
    alertText: String,
    showTip: {
      type: Boolean,
      default: false
    },
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
    },
    inputCheck: {
      type: String,
      default: ""
    }
  },
  methods: {
    cancel() {
      // 分发自定义事件(事件名: closeTip)
      this.info = "";
      this.$emit("cancel", false);
    },
    confirm() {
      if (this.isInput) {
        if (!this.limitCheck()) {
          this.isCheck = true;
          return;
        }
      }
      this.isCheck = false;
      this.$emit("confirm", this.info);
      this.info = "";
    },
    // input 檢查
    limitCheck() {
      let msg = this.info;
      if (msg === "") {
        return false;
      }
      switch (this.inputCheck) {
        // 團隊人數
        case "teamLimit":
          if (!!Number(msg)) {
            msg = Number(msg);
            if (msg < 0 || msg > 2800) {
              return false;
            }
            this.info = msg;
            return true;
          }
          return false;
          break;
      }
      return true;
    }
  }
};
</script>


<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.pop-enter-active {
  transition: 0.3s;
  .tip_text_container {
    transition: transform 0.3s;
    transform: translate(-50%, -50%) scale(1);
  }
}

.pop-enter {
  .tip_text_container {
    transform: translate(-50%, -50%) scale(0);
  }
}

.pop-leave-active {
  transition: 0.3s;

  .tip_text_container {
    transition: transform 0.3s;
    transform: translate(-50%, -50%) scale(0);
  }
}
.pop-leave {
  .tip_text_container {
    transform: translate(-50%, -50%) scale(1);
  }
}
.alert_container {
  z-index: 9999;
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
.alert_container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  // border-radius: 0 0 remCalc(20) remCalc(20);
  // border-top: 0.01rem solid #a1a1a1;
}
.cancel,
.confrim {
  flex: 1;
  height: remCalc(85);
  font-size: 0.3rem;
  line-height: 0.8rem;
  &:active {
    filter: brightness(0.8);
  }
}
.confrim {
  color: #fff;
  background: #4b4684;
}
.cancel {
  border-right: 0.01rem solid #a1a1a1;
  color: #fff;
  background-color: #969696;
}

.tip_text_container {
  position: absolute;
  overflow: hidden;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75%;
  z-index: 100000;
  // background: #f2f1f1;
  border-radius: remCalc(20);
}
.main_container{
   background: #f2f1f1;
}
.tip_icon {
  margin: 0;
  padding: 0;
}
.tip_icon img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.tip_text {
  width: 100%;
  padding: 0 5%;
  box-sizing: border-box;
  font-size: remCalc(35);
  color: #515151;
  text-align: center;
  background-color: #f2f1f1;
  padding-bottom: remCalc(30);
  padding-top: remCalc(40);
}
.tip_input {
  width: 100%;
  font-size: 0.2rem;
  background-color: #f2f1f1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: remCalc(41);
}
input {
  width: 70%;
  color: #1d1d1d;
  box-sizing: border-box;
  padding: remCalc(21) remCalc(22);
  background-color: #bebebe;
}
input::placeholder {
  font-size: 0.2rem;
}
.warn {
  border: 1px solid #c53131;
}
</style>


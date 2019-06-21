<template>
  <div>
    <headertop title="忘记密码"/>
    <div class="pwd">
      <div class="top">
        <img src="../common/images/changepwd.png" alt>
        <div v-if="stage=='verifymobile'" class="inform">验证手机号，修改你的密码</div>
        <div v-if="stage=='verifycode'" class="inform">
          我们已发送验证码到这个手机
          <p>{{mobile}}</p>
        </div>
        <div v-if="stage=='reset'" class="inform">验证成功! 请设置密码</div>
      </div>
      <div class="bottom">
        <!-- stage1 -->
        <section v-if="stage=='verifymobile'" class="stage1">
          <div class="phone">
            <img src="../common/images/num.png">
            <input type="tel" placeholder="手机号码" v-model="mobile" autofocus>
            <img src="../common/images/icon_close2.png" @click="mobile=''">
          </div>
          <div class="phone imgCode">
            <img src="../common/images/tuT.png">
            <input placeholder="图形验证码" maxlength="4" v-model="imgCode" autofocus>
            <img :src="RegImgCode" @click="getImgCode()">
          </div>
          <div class="button clickBtn" @click.prevent="SendMobile">确定</div>
        </section>

        <!-- stage2 -->
        <section v-if="stage=='verifycode'" class="stage2">
          <input type="tel" @change="sendVerify" v-model="verifyCode" maxlength="6">
          <p>沒有收到短信?</p>
          <p>
            请稍后
            <span>{{sec}}</span>
          </p>
          <div class="button clickBtn" :class="{disable:timerActive}" @click="resendCode">重新发送</div>
        </section>

        <!-- stage3 -->
        <section v-if="stage=='reset'" class="stage3">
          <div class="password">
            <img src="../common/images/passKey.png">
            <input type="password" v-model="password" placeholder="新密码" ref="newPwd">
            <img :src="changeImgNew" @click="changeType('newPwd','changeImgNew')">
          </div>
          <div class="password">
            <img src="../common/images/passKey.png">
            <input type="password" v-model="confirmPassword" placeholder="确认密码" ref="confirmPwd">
            <img :src="changeImgCon" @click="changeType('confirmPwd','changeImgCon')">
          </div>
          <div class="button clickBtn" @click="resetPwd">确定</div>
        </section>
      </div>
    </div>
    <AlertTip
      :alertText="tip.alertText"
      :showTip="tip.alertShow"
      :isCancel="false"
      @confirm="confirm"
    />
  </div>
</template>
<script>
import Headertop from "../components/Header";
import AlertTip from "../components/AlertTip";
import { checkedPhone, checkVerifyCode, restPwd } from "../api";

export default {
  components: {
    Headertop,
    AlertTip
  },
  data() {
    return {
      // 3 stages
      // verifymobile
      // verifycode
      // reset
      stage: "verifymobile",
      changeImgNew: require("../common/images/closeeye.png"),
      changeImgCon: require("../common/images/closeeye.png"),
      mobile: "",
      sec: 60,
      verifyCode: "",
      password: "",
      confirmPassword: "",
      timerActive: false,
      tip: {
        alertShow: false,
        alertText: "",
        isInput: false,
        holderText: "",
        isCancel: false,
        inputCheck: ""
      },
      RegImgCode: this.$CONFIG.BASE_URL + "/Account/GetImgCode",
      imgCode: ""
    };
  },
  beforeRouteUpdate(to, from, next) {
    this.getImgCode();
    this.stage = to.params.id;
    next();
  },
  methods: {
    // 重置密碼-校驗手機
    async SendMobile() {
      // this.$router.push({ name: "Forgetpwd", params: { id: 2} });
      // this.timer();
      if (this.rightPhone(this.mobile)) {
        const res = await checkedPhone(this.mobile, this.imgCode);
        
        console.log(res);

        if (res.result === 1) {
          this.imgCode = "";
          this.$toast("验证码已发送");
          this.$router.push({
            name: "Forgetpwd",
            params: { id: "verifycode" }
          });

          this.timer();
        } else {
          this.$toast(res.message);
        }
        return;
      }
      this.$toast("手机号格式不合法");
    },
    // 重新發送碼
    async resendCode() {
      if (this.timerActive) {
        return;
      }
      const res = await checkedPhone(this.mobile);
      if (res.result === 1) {
        this.timer();
        this.$toast("验证码已发送");
      } else {
        this.$toast(res.message);
      }
    },
    // 驗證手機
    rightPhone(param) {
      return /^1[23456789]\d{9}$/.test(param);
    },

    // 發送驗證碼
    async sendVerify() {
      const res = await checkVerifyCode(this.mobile, this.verifyCode);
      if (res.result === 1) {
        this.$toast("验证码认证成功");
        this.$router.push({ name: "Forgetpwd", params: { id: "reset" } });
      } else {
        this.$toast(res.message);
      }
    },
    // 修改密碼
    async resetPwd() {
      if (this.password !== this.confirmPassword) {
        this.$toast("两次密码输入不一致");
        return;
      }
      if (!this.checkPwd()) {
        this.$toast("密码必须8-16位,包含字母和数字组合");
        return;
      }
      const res = await restPwd(
        this.mobile,
        this.password,
        this.confirmPassword
      );
      if (res.result === 1) {
        this.alertInfo("密码设置成功");
      } else {
        this.$toast(res.message);
      }
    },
    // 密碼檢測
    checkPwd() {
      return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.password);
    },
    // 倒數
    timer() {
      if (this.timerActive) {
        return;
      }
      this.timerActive = true;
      const time = setInterval(() => {
        this.sec--;
        if (this.sec === 0) {
          clearInterval(time);
          this.sec = 60;
          this.timerActive = false;
        }
      }, 1000);
    },
    // 密碼切換
    changeType(ref, img) {
      let param = this.$refs[ref];
      if (param.type === "password") {
        param.type = "text";
        this[img] = require("../common/images/eyepass.png");
      } else {
        param.type = "password";
        this[img] = require("../common/images/closeeye.png");
      }
    },
    alertInfo(alertText) {
      this.tip.alertText = alertText;
      this.tip.alertShow = true;
    },
    confirm() {
      this.tip.alertShow = false;
      this.$router.push({ name: "Login" });
    },
    getImgCode() {
      this.RegImgCode =
        this.$CONFIG.BASE_URL + "/Account/GetImgCode?time=" + Date.now();
    }
  }
};
</script>


<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
input::-webkit-input-placeholder {
  color: #6d7082;
}
input {
  position: relative;
  top: remCalc(-5);
  background: #1f212e;
  width: 85%;
  height: 0.4rem;
  color: #4e5164;
  outline: none;
}
.button {
  color: #ffffff;
  text-align: center;
  width: remCalc(360);
  height: remCalc(80);
  font-size: remCalc(40);
  line-height: remCalc(80);
  background: linear-gradient(to right, #18cffe, #0fb4f4, #018ee5);
  border-radius: remCalc(60);
}
.pwd {
  font-size: remCalc(48);
  margin-top: remCalc(115);
  .top {
    width: 90%;
    margin: 0 auto;
    text-align: center;
    img {
      width: remCalc(200);
    }
    .inform {
      margin-top: remCalc(70);
      color: #bd9e5d;
      p {
        margin-top: remCalc(5);
        color: #acacae;
      }
    }
  }
  .bottom {
    // stage1
    .stage1 {
      width: 85%;
      margin: remCalc(140) auto 0 auto;
      .phone {
        border-bottom: 1px solid #424559;
        font-size: remCalc(35);
        vertical-align: center;
        img {
          width: remCalc(27);
        }
        input {
          margin-left: remCalc(27);

          width: 82%;
        }
        img:nth-child(3) {
          width: remCalc(31);
          margin-left: remCalc(5);
        }
      }
      .imgCode {
        margin-top: remCalc(50);
        input {
          width: 67%;
        }
        img:nth-child(3) {
          width: 20%;
        }
      }
      .button {
        margin: remCalc(90) auto 0 auto;
      }
    }
    // stage2
    .stage2 {
      margin: remCalc(200) auto 0 auto;
      text-align: center;
      input {
        width: 50%;
        border-bottom: 2px solid #424559;
        margin-bottom: remCalc(90);
      }
      p {
        font-size: remCalc(38);
        padding: remCalc(5);
        span {
          color: #00f801;
        }
      }
      .button {
        margin: remCalc(40) auto 0 auto;
      }
    }
    // stage3
    .stage3 {
      width: 85%;
      margin: remCalc(140) auto 0 auto;
      .password {
        border-bottom: 1px solid #424559;
        font-size: remCalc(35);
        vertical-align: center;
        margin-bottom: remCalc(100);
        img {
          width: remCalc(27);
        }
        input {
          margin-left: remCalc(27);
        }
        img:nth-child(3) {
          width: remCalc(31);
          margin-left: remCalc(5);
        }
      }
      .button {
        margin: remCalc(40) auto 0 auto;
      }
    }
  }
}
.disable {
  background: #6f6f6f;
  pointer-events: none;
}
</style>

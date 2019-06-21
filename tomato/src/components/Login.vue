<template>
  <div class="login">
    <div class="content">
      <div class="imgApple">
        <img src="../common/images/pineapple.png">
      </div>
    </div>
    <div class="loginContainer" v-show="showLogin">
      <div class="phone">
        <span class="span">
          <img src="../common/images/num.png">
        </span>
        <input
          type="tel"
          placeholder="请输入您的手机号"
          onfocus="this.placeholder=''"
          onblur="this.placeholder='请输入您的手机号'"
          maxlength="11"
          @change="change()"
          class="phoneNum"
          v-model="mobile"
        >
      </div>
      <div class="phone">
        <span class="span">
          <img src="../common/images/passKey.png">
        </span>
        <input
          type="password"
          placeholder="请输入您的密码"
          onfocus="this.placeholder=''"
          onblur="this.placeholder='请输入您的密码'"
          ref="inputCode"
          class="phoneNum"
          v-model="password"
        >
        <img :src="changeImg" class="eyeType" @click.prevent="changeType()">
      </div>
      <div class="remember">
        <div class="check">
          <input type="checkbox" id="rememberPW" v-model="showChecked">
          <label for="rememberPW" class="checkbox"></label>
          <!-- <img src="../common/images/checked.png" @click="showChecked=false" v-show="showChecked">
          <img src="../common/images/nochecked.png" @click="showChecked=true" v-show="!showChecked">-->
          <label class="mem" for="rememberPW">记住密码</label>
        </div>
        <span class="forget" @click.prevent="ForgetPwd()">忘记密码</span>
      </div>

      <div class="preparelogin">
        <div class="loginImg">
          <div class="log1 clickBtn" @click.prevent="login(types=0)"></div>
          <div class="log2 clickBtn" @click.prevent="showLogin=false"></div>
        </div>
        <p class="agreement">
          <span>绑定后即同意大番茄的</span>
          <span class="agree">《服务协议》</span>
        </p>
      </div>
    </div>
    <div class="loginContainer" v-show="!showLogin">
      <div class="phone">
        <span class="span">
          <img src="../common/images/num.png">
        </span>
        <input
          type="tel"
          placeholder="请输入您的手机号"
          onfocus="this.placeholder=''"
          onblur="this.placeholder='请输入您的手机号'"
          maxlength="11"
          class="phoneNum"
          v-model="mobile"
        >
      </div>
      <div class="picphone">
        <span class="span">
          <img src="../common/images/tuT.png">
        </span>
        <input type="text" placeholder="图形验证码" class="phoneCode" v-model="imgCode">
        <span class="pone">
          <img :src="srcImgCode" ref="imgCode" @click.prevent="getImgCode()">
        </span>
      </div>
      <div class="phone">
        <span class="span">
          <img src="../common/images/passKey.png">
        </span>
        <input
          type="number"
          placeholder="请输入您的验证码"
          onfocus="this.placeholder='' "
          onblur="this.placeholder='请输入您的验证码'"
          maxlength="6"
          class="phoneNum"
          v-model="smscode"
        >
        <button
          class="getCode"
          :disabled="!mobile"
          :class="{rightphone:mobile}"
          @click.prevent="getSmsCode()"
        >{{computeTime>0 ? `已发送(${computeTime}s)` : '获取验证码'}}</button>
      </div>

      <div class="remember">
        <span class="mem changePWlogin" @click.stop="showLogin=true">密码登录</span>
      </div>

      <div class="preparelogin">
        <div class="loginImg">
          <div class="log3 clickBtn" @click.prevent="login(types=1)"></div>
        </div>
        <p class="agreement">
          <span>绑定后即同意大番茄的</span>
          <span class="agree">《服务协议》</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { reqPwdLogin, reqSendCode } from "../api";
import { setCookie, getCookie, clearCookie } from "../common/utils/cookies";
import ajax from "../api/ajax";
import { Indicator } from "mint-ui";

import Storage from "../common/utils/storage";
export default {
  name: "Login",
  data() {
    return {
      type: 0, //0是密码登录
      smscode: "", //1 验证码登录
      mobile: "", //手机号
      password: "", //密码
      checked: true, //是否选择记住
      showChecked: true,
      showLogin: true,
      computeTime: 0,
      resRusult: {},
      imgCode: "",
      changeImg: require("../common/images/closeeye.png"),
      srcImgCode: this.$CONFIG.BASE_URL + "/Account/GetImgCode"
    };
  },

  computed: {
    rightPhone() {
      return /^1[23456789]\d{9}$/.test(this.mobile);
    }
  },
  mounted() {},
  methods: {
    changeType() {
      let vm = this;
      if (this.$refs.inputCode.type === "password") {
        this.$refs.inputCode.type = "text";

        vm.changeImg = require("../common/images/eyepass.png");
      } else {
        this.$refs.inputCode.type = "password";
        vm.changeImg = require("../common/images/closeeye.png");
      }
    },
    change() {
      let vm = this;
      let phoneNum = getCookie("mobile");
      let pwd = getCookie("password");

      if (this.mobile == phoneNum) {
        vm.password = pwd;
      }
    },
    //忘记密码
    ForgetPwd() {
      this.$router.push({ name: "Forgetpwd", params: { id: "verifymobile" } });
    },
    //获取图形验证码
    getImgCode() {
      this.$refs.imgCode.src =
        this.$CONFIG.BASE_URL + "/Account/GetImgCode?time=" + Date.now();
    },

    //登陆
    async login(types) {
      this.type = types;
      let {
        rightPhone,
        mobile,
        password,
        showChecked,
        imgCode,
        type,
        smscode
      } = this;
      if (mobile === "") {
        this.$toast("手机号不能为空");
        return;
      }
      if (types == 0 && password === "") {
        this.$toast("密码不能为空");
        return;
      }
      if (types == 1 && smscode === "") {
        this.$toast("验证码不能为空");
        return;
      }

      if (!rightPhone) {
        this.$toast("手机号不正确");
        return;
      }

      if (showChecked === true) {
        setCookie("mobile", mobile, 7);
        setCookie("password", password, 7);
      } else {
        clearCookie();
      }
      Indicator.open({
        text: "登录中...",
        spinnerType: "fading-circle"
      });
      let res = await reqPwdLogin(type, mobile, password, smscode);

      if (res.result === 1) {
        if (Storage.get("isVolume") == null) {
          Storage.set("isVolume", true);
        }
        Indicator.close();
        let user = res.data;
        localStorage.setItem("token", user.accessToken);
        localStorage.setItem("expireTime",res.data.expireTime)
        this.$router.replace("/main");
      } else if (res.result === 0) {
        Indicator.close();
        this.$toast(res.message);
      }
    },

    async getSmsCode() {
      // 如果当前没有计时

      if (!this.computeTime) {
        // 启动倒计时

        // 发送ajax请求(向指定手机号发送验证码短信)
        const res = await reqSendCode(this.mobile, this.imgCode);

        if (res.result === 1) {
          this.$toast("发送成功");
          this.computeTime = 60;
          this.intervalId = setInterval(() => {
            this.computeTime--;
            if (this.computeTime <= 0) {
              // 停止计时
              clearInterval(this.intervalId);
              this.computeTime = 0;
            }
          }, 1000);
        } else if (res.result === 0) {
          this.$toast(res.message);
           if (this.computeTime) {
            this.computeTime = 0;
            clearInterval(this.intervalId);
            this.intervalId = undefined;
          }
        } else {
          this.$toast("发送失败");
        }
      }
    }
  }
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  background: url("../common/images/loginBJ.jpg") no-repeat;
  background-size: 100% 100%;
  object-fit: cover;
}
input::-webkit-input-placeholder {
  color: #5a5a5c;
  font-size: 0.26rem;
}
.rightphone {
  color: black;
}
.content {
  width: 100%;
  height: 42%;
  max-width: 600px;
}
.getCode {
  flex: 0.6;
  height: 0.36rem;
  line-height: 0.36rem;
  border-radius: 0.4rem;
  text-align: center;
  background: #3b405e;
  margin-top: 0.48rem;
  border: none;
  outline: none;
  position: absolute;
  right: 0;
  bottom: 0.02rem;
}
.picphone {
  display: flex;
  height: 0.8rem;
  line-height: 0.8rem;
  margin: 0 auto;
  padding-left: 0.1rem;
  border-bottom: 1px solid #424559;
  padding-bottom: 0.1rem;
  font-size: 0.24rem;
}
.phoneCode {
  flex: 1.4;
  color: #4e5164;
  font-size: 0.24rem;
  background: none;
  outline: none;
  padding-top: 0.2rem;
  height: 0.8rem;
  padding-left: 0.34rem;
}
.span img {
  height: 0.3rem;
  width: 0.3rem;
  margin-top: 0.44rem;
}

.pone {
  flex: 0.4;
}
.pone img {
  width: 1.2rem;
  height: 0.4rem;
  margin-top: 0.44rem;
}
.imgApple {
  position: fixed;
  top: 22%;
  left: 33%;
  transform: translate(-22%, -38%);
}
.imgApple img {
  
  max-width: 4rem;
}
.loginContainer {
  width: 86%;
  height: 50%;
  margin: 0 auto;
}
.phone {
  position: relative;
  height: 1rem;
  line-height: 1rem;
  margin: 0 auto;
  padding-left: 0.1rem;
  border-bottom: 1px solid #424559;
}
.span {
  height: 0.32rem;
}
.span img {
  width: 0.3rem;
  height: 0.32rem;
}
.phoneNum {
  height: 0.4rem;
  color: #4e5164;
  font-size: 0.24rem;
  background: none;
  outline: none;
}
.remember {
  font-size: 0.26rem;
  margin: 0.2rem 0.1rem;
  display: flex;
  justify-content: space-between;
  position: relative;
}
.word {
  margin-left: 0.1rem;
  width: 0.24rem;
  height: 0.24rem;
}
.mem {
  padding-left: 0.1rem;
}
.changePWlogin {
  color: #008aff;
}
.word img {
  width: 0.22rem;
  height: 0.22rem;
}
.check {
  color: #bebebe;
  font-size: 0.24rem;
}
.checkbox {
  position: absolute;
  left: 0;
  top: 0;
  width: 0.22rem;
  height: 0.22rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: 1px solid #fff;
  border-radius: 2px;
}
.checkbox::before {
  content: "";
  position: absolute;
  top: 42%;
  left: 41%;
  width: 0%;
  height: 1px;
  background-color: #fff;
  transform: rotate(305deg) scale(0.2);
  transition: 0.1s;
  opacity: 0;
}
.checkbox::after {
  content: "";
  position: absolute;
  top: 54%;
  left: 24%;
  width: 0%;
  height: 1px;
  background-color: #fff;
  transform: rotate(45deg) scale(0.2);
  transition: 0.1s;
  opacity: 0;
}
#rememberPW:checked ~ .checkbox::before {
  content: "";
  position: absolute;
  top: 42%;
  left: 41%;
  width: 58%;
  height: 1px;
  background-color: #fff;
  transform: rotate(305deg) scale(1);
  opacity: 1;
}
#rememberPW:checked ~ .checkbox::after {
  content: "";
  position: absolute;
  top: 54%;
  left: 24%;
  width: 30%;
  height: 1px;
  background-color: #fff;
  transform: rotate(45deg) scale(1);
  opacity: 1;
}
#rememberPW {
  opacity: 0;
}
.forget {
  color: #008aff;
  font-size: 0.24rem;
}
.preparelogin {
  width: 100%;
  height: 0.8rem;
  margin: 0.4rem auto;
}
.loginImg {
  width: 100%;
  display: flex;
  margin: 0 auto;
  margin-bottom: 0.2rem;
}
.log1 {
  flex: 1;
  max-width: 5rem;
  height: 0.56rem;
  background: url("../common/images/login.png") no-repeat;
  background-size: contain;
  background-position: center;
}
.log3 {
  width: 3rem;
  margin: 0 auto;
  height: 0.56rem;
  background: url("../common/images/login.png") no-repeat;
  background-size: contain;
  background-position: center;
}
.log2 {
  flex: 1;
  max-width: 5rem;
  height: 0.56rem;

  background: url("../common/images/resetlogin.png") no-repeat;
  background-size: contain;
  background-position: center;
}
.agreement {
  width: 100%;
  margin: 0 auto;
  font-size: 0.24rem;
  color: #4e5164;
  text-align: center;
}
.agree {
  color: #12a425;
}
.eyeType {
  width: 0.36rem;
  height: 0.32rem;
  float: right;
  margin-top: 0.64rem;
}
</style>

<template>
  <div class="safeCode">
    <HeaderTop title="修改安全码"/>
    <div class="content">
      <div class="img">
        <img src="../common/images/changepwd.png">
        <p class="safephone">验证您的手机号，修改安全码</p>
      </div>
      <ul class="loginContainer">
        <li class="phone">
          <i class="fas fa-user-shield"></i>
          <input
            type="password"
            placeholder="请输入6位数字安全码"
            maxlength="6"
            onfocus="this.placeholder=''"
            onblur="this.placeholder='请输入6位数字安全码'"
            ref="inputCode"
            v-model="walletPwd"
            class="combation"
          >
          <span class="eye">
            <img :src="changeImg.inputCode" @click.prevent="changeType('inputCode')">
          </span>
        </li>
        <li class="phone">
          <i class="fas fa-user-shield"></i>
          <input
            type="password"
            placeholder="确认安全码"
            onfocus="this.placeholder=''"
            onblur="this.placeholder='确认安全码'"
            ref="safeCode"
            v-model="confirmWalletPwd"
            maxlength="6"
            class="combation"
          >
          <span class="eye">
            <img :src="changeImg.safeCode" @click.prevent="changeType('safeCode')">
          </span>
        </li>
        <li class="phone">
          <i class="fas fa-mobile-alt"></i>
          <input
            type="tel"
            placeholder="输入手机号码"
            readonly
            maxlength="11"
            onfocus="this.placeholder=''"
            onblur="this.placeholder='输入手机号码'"
            class="combation"
            v-model="mobile"
          >
        </li>
        
         <li class="phone">
          <i class="fas fa-images"></i>
          <input
            type="text"
            placeholder="请输入图形验证码"
            onfocus="this.placeholder=''"
            onblur="this.placeholder='请输入图形验证码'"
            class="combation withGetCode"
            v-model="imgCode"
           
          >
          <span class="pone getCode">
                <img
                  :src="RegImgCode"
                  ref="imgCode"
                  @click.prevent="getImgCode()"
                >
              </span> 
        </li>
        <li class="phone">
          <i class="fas fa-check-circle"></i>
          <input
            type="number"
            placeholder="请输入验证码"
            onfocus="this.placeholder=''"
            onblur="this.placeholder='请输入验证码'"
            class="combation withGetCode"
            v-model="smsCode"
            maxlength="6"
          >
          <button
            class="getCode"
            :disabled="disable"
            :class="{rightphone:mobile}"
            @click.prevent="getSmsCode()"
          >{{computeTime>0 ? `已发送(${computeTime}s)` : '获取验证码'}}</button>
        </li>

      </ul>
      <div class="sumbit clickBtn" @click.prevent="changePwd()">确定</div>
    </div>
  </div>
</template>
<script>
import HeaderTop from "../components/Header";
import { getReqSafeCode, changeMemWalletPwd } from "../api/interface";
import faqVue from "./faq.vue";
import Storage from "../common/utils/storage";
export default {
  data() {
    return {
      walletPwd: "",
      confirmWalletPwd: "",
      smsCode: "", //验证码
      mobile: "",
      imgCode:'',
      computeTime: 0,
      disable: false,
      typePwd: "password",
      typeText: "password",
      RegImgCode:this.$CONFIG.BASE_URL+'/Account/GetImgCode',
      changeImg: {
        inputCode: require("../common/images/closeeye.png"),
        safeCode: require("../common/images/closeeye.png")
      }
    };
  },
  mounted() {
    this.mobile = Storage.get("userInfo").mobile;
    this.getImgCode()
  },
  methods: {
    changeType(ref) {
      let vm = this.$refs[ref];
      if (vm.type === "password") {
        this.changeImg[ref] = require("../common/images/eyepass.png");
        vm.type = "text";
      } else {
        this.changeImg[ref] = require("../common/images/closeeye.png");
        vm.type = "password";
      }
    },
    changePwd() {
      const { mobile, smsCode, walletPwd, confirmWalletPwd } = this;
      const data = { mobile, smsCode, walletPwd, confirmWalletPwd };
      const BASE_URL = this.$CONFIG.BASE_URL+"/Account";
      if (mobile == "" || walletPwd === "" || confirmWalletPwd === "") {
        this.$toast("密码不能为空");
        return;
      }
      if (smsCode == "") {
        this.$toast("验证码不能为空");
        return;
      }
       
      changeMemWalletPwd(data)
        .then(res => {
          let message = res.message.split(";").join("\n");
          let duration = 1000;
          this.$toast({ message, duration });
          if (res.result === 1) {
            setTimeout(() => {
              this.$router.go(-1);
            }, duration);
          }
        })
        .catch(err => {
          console.log(err.response);
        });
    },
    //获取图形验证码
      getImgCode() {
        this.$refs.imgCode.src = this.$CONFIG.BASE_URL+"/Account/GetImgCode?time="+ Date.now()
      },
    showToast(message) {},
    async getSmsCode() {
      // 手機號碼為空不發送驗證碼
      // if (!this.mobile) {
      //   this.$toast("手机号不得为空");
      //   return;
      // }
       if(this.imgCode==''){
         this.$toast("图形验证码不能为空");
         return;
      }
      if (this.computeTime == 0) {
        this.computeTime = 60;
        this.interval = setInterval(() => {
          this.computeTime--;
          if (this.computeTime <= 0) {
            clearInterval(this.interval);
            return;
          }
        }, 1000);
      }
      let params = {
        mobile: this.mobile,
        imgCode:this.imgCode
      };
      getReqSafeCode(params)
        .then(res => {
          if (res.result === 1) {
            this.$toast(res.message);
          }else if(res.result==0){
            this.$toast(res.message);
         if (this.computeTime) {
          this.computeTime = 0;
          clearInterval(this.interval);
          this.interval = undefined;
          }
          }
        })
        .catch(err => {
          
          this.computeTime = 0;
          clearInterval(this.interval);
          if (err.response.status === 500) {
            this.$toast("请输入用户当前手机号");
            return;
          }
          this.$toast(err.response.data.errors.mobile[0]);
        });
    }
  },
  watch: {
    computeTime(val) {
      this.disable = val !== 0 ? true : false;
    }
  },
  components: {
    HeaderTop
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.safeCode {
  overflow: hidden;
}
.content {
  margin: remCalc(21) auto;
  width: 100%;
  text-align: center;
}
.img img {
  display: block;
  width: 2rem;
  height: 2rem;
  margin: 0 auto;
}
.content {
  margin: 1.2rem 0 0.5trm auto;
  text-align: center;
}
.safephone {
  font-size: 0.38rem;
  color: #545a83;
  margin-top: 0.2rem;
}
.loginContainer {
  width: 75%;
  margin: 0 auto;
}
.pone img {
  width: 1.2rem;
  height: 0.4rem;
  margin-bottom: 0.6rem;
}

.phone {
  position: relative;
  display: flex;
  align-items: flex-end;
  width: 100%;
  padding-top: 0.6rem;
  font-size: 0.24rem;

  i {
    width: 10vw;
    padding-bottom: calc(0.1rem + 1px);
  }
  input {
    width: 100%;
    border-bottom: 1px solid #424559;
    padding-bottom: 0.1rem;
    color: rgb(202, 202, 202);
    box-sizing: border-box;
    &.withGetCode {
      padding-right: 1.4rem;
    }
  }
  .getCode {
    box-sizing: border-box;
    position: absolute;
    right: 0;
    bottom: calc(0.1rem + 1px);
    border-radius: 0.4rem;
    text-align: center;
    background: #3b405e;
    border: none;
    outline: none;
    height: 0.33rem;
    font-size: 0.2rem;  
  }
  
  .eye img {
    position: absolute;
    bottom: 0.1rem;
    right: 0.1rem;
    width: 0.32rem;
    height: 0.26rem;
    margin-top: 0.6rem;
  }
}
.combation,
.combationCode {
  color: #4e5164;
  font-size: 0.24rem;
  background: none;
  outline: none;
}
.sumbit {
  width: 75%;
  border-radius: 0.5rem;
  font-size: 0.28rem;
  color: #ffffff;
  margin: 0.6rem auto;
  text-align: center;
  height: 0.6rem;
  line-height: 0.6rem;
  background: linear-gradient(to right, #18cffe, #0fb4f4, #018ee5);
}
</style>

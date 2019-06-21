<template>
  <div class="Register">
    <div class="content">
      <div class="imgApple">
        <img src="../common/images/pineapple.png">
      </div>
    </div>
    <ul class="loginContainer">
      <li class="phone">
        <span class="span">
          <img src="../common/images/phoneIcon.png">
        </span>
        <input type="tel" placeholder="请输入您的手机号" maxlength="11" class="phoneNum" v-model="mobile">
      </li>
      <li class="phone">
        <span class="span">
          <img src="../common/images/tuT.png">
        </span>
        <input type="text" placeholder="图形验证码"  class="phoneCode" v-model="imgCode">
        <span class="pone">
          <img
            :src="srcImgCode"
            ref="imgCode"
            @click.prevent="getImgCode()"
          >
        </span>
      </li>
      <li class="phone">
        <span class="span">
          <img src="../common/images/tuT.png">
        </span>
        <input type="tel" placeholder="手机验证码" maxlength="6" class="phoneCode" v-model="smsCode">
        <button
          :disabled="!mobile"
          :class="{rightphone:mobile}"
          class="verificationCode"
          @click.prevent="getSmsCode()"
        >{{computeTime>0 ? `已发送(${computeTime}s)` : '获取验证码'}}</button>
      </li>
      <li class="phone">
        <span class="span">
          <img src="../common/images/passKey.png">
        </span>
        <input
          type="password"
          placeholder="密码必须8-16位,包含字母和数字组合"
          maxlength="16"
          ref="input"
          class="combation"
          v-model="password"
        >
        <span class="eye">
          <img :src="changeImg" @click.prevent="changeType(changeImg)">
        </span>
      </li>
      <li class="phone">
        <span class="span">
          <img src="../common/images/passKey.png">
        </span>
        <input
          type="password"
          placeholder="确认密码"
          ref="input2"
          maxlength="16"
          class="combation"
          v-model="confirmPassword"
        >
        <span class="eye">
          <img :src="changeImg2" @click.prevent="changeType2(changeImg2)">
        </span>
      </li>

      <div class="submit" @click.stop="Register()"></div>
      <div class="alreadyAccount">
        <p>
          <span class="player">已有账号的玩家</span>&nbsp;&nbsp;&nbsp;&nbsp;
          <span @click.prevent="clickherhe()" class="green">请点这里</span>
        </p>
      </div>
    </ul>
  </div>
</template>
<script>
import { reqSmsCode, reqRegister } from "../api";
//   import {reqRegister} from '../api/interface'
import Storage from "../common/utils/storage";
import randomName from '../common/datalist/nickName'
import { Indicator} from 'mint-ui';
export default {
  data() {
    return {
      mobile: "", //手机号码
      imgCode: "", //图形验证码
      smsCode: "", //手机验证码
      password: "", //密码设置
      confirmPassword: "", //确认密码
      TeamCode: "", //排线码
      changeImg: require("../common/images/closeeye.png"),
      changeImg2: require("../common/images/closeeye.png"),
      computeTime: 0, //手机倒计时
      ReferralCode: "", //推广码
      nickName:'',  //昵称
      srcImgCode:this.$CONFIG.BASE_URL+'/Account/GetImgCode',
      headUrl:'m_01.png'//默认头像
    };
  },
  computed: {
    rightPhone() {
      return /^1[23456789]\d{9}$/.test(this.mobile);
    },
    passWordSet() {
      return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.password);
    }
  },
  mounted() {
    let vm =this;
    this.getSubstr();
    vm.nickName = randomName.getNickHeader()+randomName.getNickFoot()

   
  },

  methods: {
    getSubstr() {
      var url = window.location.href;
      let res = {},
        query = url.split(/\?(?!.*\?)/)[1];
      if (query) {
        let arr = query.split("&");
        for (let i = 0, len = arr.length; i < len; i++) {
          res[arr[i].split("=")[0]] = arr[i].split("=")[1];
        }
      }
      this.ReferralCode = res.ReferralCode;
      this.TeamCode = res.TeamCode;
    },
    //获取图形验证码
    getImgCode() {
     
        this.$refs.imgCode.src = this.$CONFIG.BASE_URL+"/Account/GetImgCode?time="+ Date.now()
    },
   //获取手机验证码
    async getSmsCode() {
      if(this.imgCode==''){
         this.$toast("图形验证码不能为空");
        return;
      } 
      if (!this.computeTime) {
      
        this.computeTime = 60;
        this.interTime = setInterval(() => {
          this.computeTime--;
          if (this.computeTime ===0) {
            clearInterval(this.interTime);
          }
        }, 1000);
        
        const res = await reqSmsCode(this.mobile,this.imgCode);
        
        if (res.result === 1) {
          this.$toast("短信已发送");
        } else if(res.result==0){
          this.$toast(res.message);
		     if (this.computeTime) {
          this.computeTime = 0;
          clearInterval(this.interTime);
          this.interTime = undefined;
          }
        }
      }
    },
    async Register() {
      const {
        mobile,
        password,
        imgCode,
        smsCode,
        passWordSet,
        confirmPassword,
        rightPhone,
        TeamCode,
        nickName,
        ReferralCode,
        headUrl
      } = this;

      if (!rightPhone) {
        this.$toast("手机号输入错误");
        return;
      } else if (imgCode == "") {
        this.$toast("图形验证码不能为空");
        return;
      } else if (smsCode === "") {
        this.$toast("手机验证码不能为空");
        return;
      } else if (password === "") {
        this.$toast("密码设置不能为空");
        return;
      } else if (confirmPassword === "") {
        this.$toast("请先确认密码");
        return;
      } else if (!passWordSet) {
        this.$toast("密码必须8-16位,包含字母和数字组合");
        return;
      } else if (password != confirmPassword) {
        this.$toast("两次密码输入不一致");
        return;
      }
       Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      });
      const res = await reqRegister(
        mobile,
        imgCode,
        smsCode,
        password,
        confirmPassword,
        ReferralCode,
        TeamCode,
        nickName,
        headUrl
      );
       
      if (res.result === 1) {
        Indicator.close()
        this.$toast("注册成功");
        localStorage.setItem("token", res.data.accessToken);
         localStorage.setItem("expireTime",res.data.expireTime)
        this.$router.replace({ name: "Main" });
      } else if (res.result === 0) {
        Indicator.close()
        this.$toast(res.message);
      }
    },
    clickherhe() {
      this.$router.replace("/login");
    },
    changeType() {
      let vm = this;
      if (this.$refs.input.type === "password") {
        this.$refs.input.type = "text";
        vm.changeImg = require("../common/images/eyepass.png");
      } else {
        this.$refs.input.type = "password";
        vm.changeImg = require("../common/images/closeeye.png");
      }
    },
    changeType2() {
      let vm = this;
      if (this.$refs.input2.type === "password") {
        this.$refs.input2.type = "text";
        vm.changeImg2 = require("../common/images/eyepass.png");
      } else {
        this.$refs.input2.type = "password";
        vm.changeImg2 = require("../common/images/closeeye.png");
      }
    }
  }
};
</script>

<style scoped>
.Register {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: url("../common/images/registerBJ.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}
.regTent {
  width: auto;
  height: auto;
}
.rightphone {
  color: black;
}
.content {
  position: relative;
  width: 100%;
  height: 4.6rem;
  margin-bottom: -0.4rem;
}
.imgApple {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-55%, -50%);
}
.imgApple img {
  
  max-width: 4rem;
 
}
.loginContainer {
  width: 86%;
  height: auto;
  margin: 0 auto;
  overflow: hidden;
  margin-top: 0.4rem;
}
.phone {
  display: flex;
  height: 0.8rem;
  line-height: 0.8rem;
  margin: 0 auto;
  padding-left: 0.1rem;
  border-bottom: 1px solid #424559;
  padding-bottom: 0.1rem;
  font-size: 0.24rem;
}
.green {
  color: #0bc221;
}

.span img {
  height: 0.3rem;
  width: 0.3rem;
  margin-top: 0.44rem;
}
.span,
.pone {
  flex: 1;
}
.verificationCode {
  flex: 2.2;
}
.verificationCode {
  background: #ffffff;
  color: #696a6f;
  font-size: 0.22rem;
  text-align: center;
  height: 0.4rem;
  line-height: 0.4rem;
  margin-top: 0.4rem;
  border-radius: 0.06rem;
  border: none;
  outline: none;
}
.pone img {
  width: 1.2rem;
  height: 0.4rem;
  margin-top: 0.44rem;
}
.phoneNum,
.phoneCode,
.combation {
  color: #4e5164;
  font-size: 0.24rem;
  background: none;
  outline: none;
  padding-top: 0.2rem;
  height: 0.8rem;
}
.phoneNum {
  flex: 8;
}
.phoneCode {
  flex: 6;
}
.combation {
  flex: 8;
}
.eye {
  flex: 1;
}
.eye img {
  width: 0.32rem;
  height: 0.26rem;
  margin-top: 0.44rem;
}
input::-webkit-input-placeholder {
  color: #4a4d5f;
}
.submit {
  width: 80%;
  height: 0.5rem;
  margin: 0.6rem auto;
  background: url("../common/images/register.png") no-repeat;
  background-size: 100% 100%;
}
.alreadyAccount {
  margin-top: 0.4rem;
  font-size: 0.18rem;
  text-align: center;
}
.player {
  color: #eaeaea;
}
.click {
  color: #0bc221;
}
</style>

<template>
  <div class="safeCode">
    <HeaderTop title="绑定手机"/>
    <div class="content">
      <div class="img">
        <img src="../common/images/changepwd.png">
        <p class="safephone">绑定手机号，让你的账号更安全</p>
      </div>
      <ul class="loginContainer">
        <li class="phone">
          <i class="fas fa-mobile-alt "></i>
          <input type="tel" placeholder="请输入手机号" v-model="mobile" class="combation" maxlength="11">
        </li>
        <li class="phone">
          <i class="fas fa-images"></i>
          <input type="tel" placeholder="请输入图形验证码" v-model="imgCode" class="combation">
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
            v-model="smsCode"
            class="combation withGetCode"
            maxlength="6"
          >
          <button
            class="getCode"
            :disabled="!mobile"
            :class="{rightphone:mobile}"
            @click.prevent="getSmsCode()"
          >{{computeTime>0 ? `已发送(${computeTime}s)` : '获取验证码'}}</button>
        </li>
        <li class="phone">
          <i class="fas fa-user-shield"></i>
          <input type="number" placeholder="请输入安全码" v-model="walletPwd" class="combation">
        </li>
      </ul>
      <div class="sumbit clickBtn" @click.prevent="changePwd()">确定</div>
    </div>
  </div>
</template>

<script>
import { reqBindCode, reqMOdiPhone } from "../api";
import HeaderTop from "../components/Header";
import Storage from "../common/utils/storage";
import { changePhoneNumberBind } from "../api/interface";

export default {
  data() {
    return {
      computeTime: 0,
      mobile: "",
      walletPwd: "",
      resetCode: "",
      imgCode:'',
      smsCode: "", //验证码
      RegImgCode:this.$CONFIG.BASE_URL+'/Account/GetImgCode',
    };
  },
  mounted(){
       this.getImgCode()
  },
  methods: {
    async getSmsCode() {
      if(this.imgCode==''){
         this.$toast("图形验证码不能为空");
         return;
      }
      if (!this.computeTime) {
        this.computeTime = 60;
        this.interTime = setInterval(() => {
          this.computeTime--;
          if (this.computeTime < 0) {
            clearInterval(this.interTime);
            this.computeTime = 0;
          }
        }, 1000);
      }
      const res = await reqBindCode(this.mobile,this.imgCode);
       
      if (res.result === 1) {
       
        this.$toast(res.message);
        // setTimeout(() => {
        //   instance.close();
        //   this.$router.go(-1);
        // }, 1000);
      } else if (res.result == 0) {
        this.$toast(res.message);
        if (this.computeTime) {
          this.computeTime = 0;
          clearInterval(this.interTime);
          this.interTime = undefined;
        }
      }
    },

    getImgCode() {
       this.$refs.imgCode.src = this.$CONFIG.BASE_URL+"/Account/GetImgCode?time="+ Date.now()
    },

    changePwd() {
      const { mobile, smsCode, walletPwd } = this;
      const data = { mobile, smsCode, walletPwd };
      if (mobile === "" || smsCode === "" || walletPwd === "") {
        this.$toast("密码不能为空");
        return;
      }

      changePhoneNumberBind({ mobile, smsCode, walletPwd })
        .then(res => {
          let duration = 2000;
          this.$toast({
            message: `${res.message}  ${
              res.result === 1 ? " 即将返回上一页" : ""
            }`,
            duration
          });
          if (res.result === 1) {
            setTimeout(() => {
              this.$router.go(-1);
            }, duration + 300);
          }
        })
        .catch(err => {
          this.$toast(err.response);
        });
    }
  },
  components: {
    HeaderTop
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.rightphone {
  color: black;
}
.content {
  margin: remCalc(21) auto;
  width: 100%;
  text-align: center;
}
.pone img {
  width: 1.2rem;
  height: 0.4rem;
  
}
.img img {
  display: block;
  width: 2rem;
  height: 2rem;
  margin: 0 auto;
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
    padding: remCalc(8) remCalc(10);
    padding-bottom: 0.1rem;
    color: rgb(202, 202, 202);
    box-sizing: border-box;
    font-size: 0.24rem;
    background: none;
    outline: none;
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
    & ~ input {
      background-color: #fff;
    }
  }
}
.sumbit {
  width: 80%;
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

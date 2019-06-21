<template>
  <div class="bindCard">
    <header-top title="修改银行卡"/>
    <div class="content">
      <div class="container">
        <ul class="bank">
          <li>
            绑定手机号:
            <input
              type="tel"
              placeholder="请输入手机号"
              v-model="mobile"
              maxlength="11"
              class="first"
            >
          </li>
           <li class="phone">
            图形验证码:
            <div class="confirm">
              <input
                type="text"
                placeholder="请输入图形验证码"
                class="smscode"
                v-model="imgCode"
               
              >
              <span class="pone getCode2">
                <img
                  :src="RegImgCode"
                  ref="imgCode"
                  @click.prevent="getImgCode()"
                >
              </span> 
            </div>
          </li>
          <li class="phone">
            验证码:
            <div class="confirm">
              <input
                type="number"
                placeholder="请输入验证码"
                class="smscode"
                v-model="smsCode"
                maxlength="6"
              >
              <button
                class="getCode clickBtn"
                :disabled="!mobile"
                :class="{rightphone:mobile}"
                @click.prevent="getSmsCode()"
              >{{computeTime>0 ? `已发送(${computeTime}s)` : '获取验证码'}}</button>
            </div>
          </li>
          <li>
            银行账号:
            <input
              type="number"
              placeholder="请输入银行卡号"
              v-model="setcarno"
              maxlength="18"
              class="accountcard"
            >
          </li>
          <li class="account">
            确认银行账号:
            <input type="number" placeholder="请输入银行卡号" v-model="carNo" class="resetcard">
          </li>
        </ul>
        <ul class="kaihu">
          <li>
            <span>开户行:</span>
            <select v-model="bankName" class="kh">
              <option v-for="(item,index) in currencyArray" :key="index">{{item.text}}</option>
            </select>
          </li>

          <li>
            <span>开户行省份:</span>
            <select class="provice" v-model="bankProvince">
              <option
                v-for="(option,index) in userCity"
                :value="option.name"
                :key="index"
              >{{option.name}}</option>
            </select>
          </li>

          <li>
            <span>开户城市:</span>
            <select v-model="bankCity" class="shangh">
              <option
                v-for="(option,index) in cityArr"
                :value="option.name"
                :key="index"
              >{{option.name}}</option>
            </select>
          </li>

          <li>
            <span>开户行支行:</span>
            <input placeholder="请输入支行信息" class="last" v-model="bankBrr">
          </li>
        </ul>
      </div>
      <div class="btn clickBtn" @click.prevent="bindCard">确认修改</div>
    </div>
  </div>
</template>
<script>
import HeaderTop from "../components/Header";
import Storage from "../common/utils/storage";
import { sendUpdateBankCode, getBindBankNo } from "../api/interface";
import cityData from "../common/datalist/data";
import bankList from "../common/datalist/bank";
export default {
  data() {
    return {
      carNo: "", //银行卡账号
      setcarno: "",
      accountName: "",
      mobile: "",
      smsCode: "",
      imgCode:'',
      bankName: "招商银行",
      bankProvince: "北京",
      bankCity: "北京",
      bankBrr: "",
      computeTime: 0,
      userInfo: "",
      accountName: "",
      RegImgCode:this.$CONFIG.BASE_URL+'/Account/GetImgCode',
      userCity: [],
      district: "东城区",
      cityArr: [],
      districtArr: [],
      currencyArray: [] //银行数据
    };
  },
  computed: {
    myTrim(x) {
      return x.replace(/^\s+|\s+$/gm, "");
    }
  },
  mounted() {
    this.userInfo = Storage.get("userInfo");
    this.currencyArray = bankList;
    this.userCity = cityData;
    this.updateCity();
    this.updateDistrict();
  },
  methods: {
    async bindCard() {
      let reg = new RegExp(/\d{6}$/);
      let {
        carNo,
        mobile,
        smsCode,
        bankName,
        bankProvince,
        bankCity,
        bankBrr
      } = this;

      if (
        !carNo ||
        !mobile ||
        !smsCode ||
        !bankName ||
        !bankProvince ||
        !bankCity ||
        !bankBrr
      ) {
        this.$toast("选择或设置的内容不能为空");
        return;
      }
      if (!reg.test(smsCode)) {
        this.$toast("验证码必须输入6位");
        return;
      }
      if (this.setcarno != carNo) {
        this.$toast("2次银行账号输入不一致");
        return;
      }
      let data = {
        carNo,
        mobile,
        smsCode,
        bankName,
        bankProvince,
        bankCity,
        bankBrr
      };

      let res = await getBindBankNo(data);
      if (res.result == 1) {
        this.$toast(res.message);
      } else if (res.result == 0) {
        this.$toast(res.message);
      }
    },
    //获取图形验证码
    getImgCode() {
       this.$refs.imgCode.src = this.$CONFIG.BASE_URL+"/Account/GetImgCode?time="+ Date.now()
    },
    
    async getSmsCode() {
      const { mobile,imgCode } = this;
      let params = {
        mobile,imgCode
      };
      if(this.imgCode==''){
         this.$toast("图形验证码不能为空");
         return;
      }
      if (!this.computeTime) {
        const res = await sendUpdateBankCode(params);
        if (res.result === 1) {
          this.$toast("验证码已发送");
          // 启动倒计时
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
    },

    //省市联动
    updateCity() {
      for (var i in this.userCity) {
        var obj = this.userCity[i];
        if (obj.name == this.bankProvince) {
          this.cityArr = obj.sub;

          break;
        }
      }
      this.bankCity = this.cityArr[1].name;
    },
    updateDistrict() {
      for (var i in this.cityArr) {
        var obj = this.cityArr[i];
        if (obj.name == this.bankCity) {
          this.districtArr = obj.sub;
          break;
        }
      }
      if (
        this.districtArr &&
        this.districtArr.length > 0 &&
        this.districtArr[1].name
      ) {
        this.district = this.districtArr[1].name;
      } else {
        this.district = "";
      }
    }
  },
  watch: {
    bankProvince() {
      this.updateCity();
      this.updateDistrict();
    },
    bankCity() {
      this.updateDistrict();
    }
  },
  components: {
    HeaderTop
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.bindcard {
  overflow: hidden;
}
.content {
  width: 100%;
  margin: remCalc(21) auto;
  font-size: 0.24rem;
}
.pone img {
  width: 1.2rem;
  height: 0.4rem;
  
}
select option {
  color: black;
  padding: 0;
}
.opt {
  width: 2rem;
}
.container {
  width: 100%;
  margin: 0 auto;
}
.phone {
  position: relative;
  height: 1rem;
  line-height: 1rem;
  margin: 0 auto;
}
.kaihu select {
  width: 4rem;
  height: 0.5rem;
  background: none;
  border: 0.01rem solid #3a3d55;
  color: #ffffff;
  padding-left: 0.01rem;
}
.bank,
.kaihu {
  width: 100%;
  margin-bottom: 0.2rem;
  background: #1b1b28;
  padding: 0.3rem 5%;
  box-sizing: border-box;
}
.kaihu {
  margin-bottom: 0.5rem;
}
select option {
  color: black;
  padding: 0;
}
.opt {
  width: 2rem;
}
.rightphone {
  color: black;
}
.phone {
  position: relative;
  height: 1rem;
  line-height: 1rem;
  margin: 0 auto;
}

.content li {
  height: 0.8rem;
  line-height: 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .confirm {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    input {
      width: 2.4rem;
    }
  }
}
.getCode {
  display: inline-block;
  height: 0.36rem;
  line-height: 0.36rem;
  border-radius: 0.4rem;
  text-align: center;
  background: #3b405e;
  border: none;
  outline: none;
  font-size: 0.2rem;
  margin-left: 0.2rem;
  white-space: nowrap;
  width: 1.4rem;
}
.getCode2 {
  display: inline-block;
  height: 0.36rem;
  line-height: 0.36rem;
  border-radius: 0.4rem;
  text-align: center;
  border: none;
  outline: none;
  font-size: 0.2rem;
  margin-left: 0.2rem;
  white-space: nowrap;
  width: 1.4rem;
  margin-bottom: 0.1rem
}

.kaihu select {
  width: 4rem;
  height: 0.5rem;
  background: none;
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: 0.01rem solid #3a3d55;
  color: #ffffff;
  padding-left: 0.01rem;
}
input {
  border-bottom: 0.01rem solid #3a3d55;
  outline: none;
  background: none;
  height: 0.5rem;
  width: 4rem;
  padding: 0.2rem 0.1rem;
  box-sizing: border-box;
  color: #ffffff;
}
.btn {
  width: 75%;
  height: 0.7rem;
  line-height: 0.7rem;
  text-align: center;
  color: #ffffff;
  font-size: 0.28rem;
  margin: 0.2rem auto;
  border-radius: 0.4rem;
  background: linear-gradient(to right, #18cfff, #0db0f2, #018ce4);
  background: -moz-linear-gradient(to right, #18cfff, #0db0f2, #018ce4);
  background: -o-linear-gradient(to right, #18cfff, #0db0f2, #018ce4);
  background: -webkit-linear-gradient(to right, #18cfff, #0db0f2, #018ce4);
}
.attation {
  width: 70%;
  margin: 0 auto;
  font-size: 0.22rem;
  color: #685c44;
}
</style>

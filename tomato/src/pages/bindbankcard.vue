<template>
  <div class="bindCard">
    <header-top title="绑定银行卡"/>
    <div class="content">
      <div class="container">
        <ul class="bank">
          <li>
            持卡人姓名:
            <input placeholder="请输入持卡人姓名" v-model="accountName" class="cardname">
          </li>
          <li>
            银行账号:
            <input
              type="number"
              placeholder="请输入银行卡号"
              v-model="setcarNo"
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
            开户行:
            <select v-model="bankName" class="kh">
              &nbsp;
              <option v-for="(item, index) in currencyArray" :key="index">{{item.text}}</option>
            </select>
          </li>
          <li>
            <span class="provice">开户行省份:</span>
            <select v-model="bankProvince">
              <option v-for="(op, index) in options" :value="op.name" :key="index">{{op.name}}</option>
            </select>
          </li>
          <li>
            <span>开户城市:</span>
            <select v-model="bankCity" class="shangh">
              <option v-for="(city, index) in cityArr" :value="city.name" :key="index">{{city.name}}</option>
            </select>
          </li>
          <li>
            <span>开户行支行:</span>
            <input placeholder="请输入支行信息" class="last" v-model="bankBrr">
          </li>
        </ul>
      </div>
      <div class="btn clickBtn" @click.prevent="bindCard">绑定</div>
    </div>
  </div>
</template>
<script>
import HeaderTop from "../components/Header";
import cityData from "../common/datalist/data";
import bankList from "../common/datalist/bank";
import { getBindBankNo } from "../api/interface";
import Storage from "../common/utils/storage";
export default {
  data() {
    return {
      selected: "any",
      carNo: "", //银行卡账号
      setcarNo: "",
      accountName: "",
      mobile: "",
      smsCode: "",
      bankName: "招商银行",
      bankProvince: "北京",
      bankCity: "北京",
      bankBrr: "",
      options: [],
      cityArr: [],
      currencyArray: [],
      districtArr: []
    };
  },
  methods: {
    onValuesChange(picker, values) {
      if (values[0] > values[1]) {
        picker.setSlotValue(1, values[0]);
      }
    },
    bindCard() {
      let {
        carNo,
        accountName,
        mobile,
        smsCode,
        bankName,
        bankProvince,
        bankCity,
        bankBrr
      } = this;
      localStorage.setItem("accountName", accountName);
      if (
        !carNo ||
        !accountName ||
        !bankName ||
        !bankProvince ||
        !bankCity ||
        !bankBrr
      ) {
        this.$toast("选择和设置的内容不能为空");
        return;
      }

      if (this.setcarNo != carNo) {
        this.$toast("2次银行账号输入不一致");
        return;
      }
      const BASE_URL = this.$CONFIG.BASE_URL;
      getBindBankNo({
        carNo,
        accountName,
        bankName,
        bankProvince,
        bankCity,
        bankBrr
      })
        .then(res => {
          console.log(res);
          if (res.result === 1) {
            this.$toast(res.message);
            this.$router.replace("/myself");
          } else if (res.result === 0) {
            this.$toast(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //省市联动
    updateCity() {
      for (var i in this.options) {
        var obj = this.options[i];
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
  mounted() {
    if (!!Storage.get("userInfo").carNo) {
      this.$router.go(-1);
    }
    this.currencyArray = bankList;
    this.options = cityData;
    this.updateCity();
    this.updateDistrict();
  },
  components: {
    HeaderTop
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.content {
  width: 100%;
  margin: 0 auto;
  font-size: 0.24rem;
  padding-top: remCalc(21);
}
.container {
  width: 100%;
  margin: 0rem auto;
}
select option {
  color: black;
}
.middle {
  width: 100%;
  height: 0.5rem;
  background: #1f212e;
}
.provice {
  margin-right: 0.3rem;
}
.resetcard {
  margin-left: 0.16rem;
}
.accountcard {
  margin-left: 0.62rem;
}
.cardname {
  margin-left: 0.36rem;
}
.kh {
  margin-left: 0.8rem;
}
.shangh {
  margin-left: 0.62rem;
}
.last {
  margin-left: 0.37rem;
}
.content li {
  height: 0.8rem;
  line-height: 0.8rem;
}

.bank li {
  margin: 0 auto;
  text-align: center;
}
.kaihu li {
  text-align: center;
}
.kaihu select {
  width: 3.2rem;
  height: 0.5rem;
  background: none;
  border: none;
  outline: none;
  border-bottom: 0.01rem solid #3a3d55;
  color: #ffffff;
}

.bank,
.kaihu {
  width: 100%;
  margin: 0.2rem 0;
  padding: 0.2rem 0;
  background-color: #1c1b29;
}
.bank {
  margin: 0 auto;
}
input {
  border-bottom: 0.01rem solid #3a3d55;
  outline: none;
  background: none;
  height: 0.5rem;
  width: 3.2rem;
  color: #ffffff;
}

.count {
  padding-left: 0.7rem;
}
.action {
  padding-left: 0.6rem;
}
.privce {
  padding-left: 0.1rem;
}
.city {
  padding-left: 0.34rem;
}
.branch {
  padding-left: 0.1rem;
}
.btn {
  width: 2.8rem;
  height: 0.7rem;
  line-height: 0.7rem;
  text-align: center;
  color: #ffffff;
  font-size: 0.28rem;
  margin: 0 auto;
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

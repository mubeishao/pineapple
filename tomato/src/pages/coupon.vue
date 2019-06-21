<template>
  <div class="coupon">
    <headertop title="银行卡兑换"/>
    <div class="content">
      <ul class="card">
        <li>
          <p class="name">银行卡账号:</p>

          <span class="font_acct">{{userInfo.carNo|accountFormat}}</span>
        </li>
        <li>
          <p class="name">银行卡实名:</p>
          <span class="font_acct">{{userInfo.realName}}</span>
        </li>
        <li>
          <p class="name">账号余额:</p>
          <span class="font_acct">{{userInfo.money}}</span>
        </li>
        <li class="tikuan">
          <p class="name">提款金额:</p>
          <input
            type="number"
            placeholder="输入金额"
            v-model="takeMoney"
            onfoucs="this.plcaeholder=''"
            onblur="this.plcaeholder='输入金额'"
            class="place"
          >
        </li>
        <li>
          <p class="name">可提金额:</p>
          <span class="font_acct">{{userInfo.money}}</span>
        </li>
        <li>
          <p class="name">手续费:</p>
          <span class="font_acct">{{userInfo.fee}}</span>
        </li>
        <li>
          <span class="name">实际到账:</span>
          <span class="font_acct">{{this.takeMoney-userInfo.fee>0?this.takeMoney-userInfo.fee:''}}</span>
        </li>
        <li>
          <span class="name">安全码:</span>
          <input  class="place" type="password" placeholder="请输入安全码" v-model="safeCode" maxlength="6">
        </li>
      </ul>
    </div>
    <div class="time">
      <ul class="dat">
        <li>提款时间：24小时制</li>
        <li>单笔限额：100 -- 50000</li>
        <li>每日限额：200000</li>
        <li>手续费说明:每笔{{userInfo.fee}}元</li>
      </ul>

      <div class="look">
        <div class="set clickBtn" @click.prevent="resettransfer()">确定兑换</div>
        <div class="record clickBtn" @click.prevent="conversion()">查看兑换记录</div>
      </div>
    </div>
  </div>
</template>

<script>
import Headertop from "../components/Header";
import Storage from "../common/utils/storage";
import { getCardTransfer } from "../api/interface";
import qs from "qs";
export default {
  name: "coupon",
  data() {
    return {
      item: "123456789987654321",
      fee: 0, //手续费
      takeMoney: "", //输入金额
      safeCode: "", //安全码
      userInfo: {},
      realAmount: 0,
      cardNumber: ""
    };
  },
  computed: {
    Getsafecode() {
      return /^\d{6}$/.test(this.safeCode);
    }
  },
  mounted() {
    this.userInfo = Storage.get("userInfo");
    
    this.cardNumber = this.userInfo.carNo;

  },
  methods: {
    async resettransfer() {
      const { userInfo, takeMoney, fee } = this;
      if (!takeMoney) {
        this.$toast("请输入提款金额");
        return;
      }
      if (takeMoney > userInfo.money) {
        this.$toast("输入金额不可大于可提金额");
        return;
      }

      if (takeMoney < userInfo.fee) {
        this.$toast("提款金额要高于手续费");
        return;
      }
      if (!this.safeCode) {
        this.$toast("请输入安全码");
        return;
      }
      if (!this.Getsafecode) {
        this.$toast("输入安全码为6码");
        return;
      }
      let data = {
        type: 2,
        carNo: this.cardNumber,
        accountName: this.userInfo.realName,
        amount: this.takeMoney,
        fee: userInfo.fee,
        realAmount:
          this.takeMoney - this.fee > 0 ? this.takeMoney - this.fee : 0,
        sCode: this.safeCode
      };
      let res = await getCardTransfer(data);
      console.log(res);
      if (res.result == 1) {
        this.$toast(res.message);
        setTimeout(() => {
          this.$router.replace({ name: "MySelf" });
        }, 1500);
      } else if (res.result == 0) {
        this.$toast(res.message);
      }
    },
    conversion() {
      this.$router.push({ name: "RecordConversion" });
    }
  },
  //"61252125412545871"
  filters: {
    hideMiddle(val) {
      return val.substring(0, 7) + "*******" + val.substring(14, 18);
    }
  },
  components: {
    Headertop
  }
};
</script>

}
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.content {
  margin: remCalc(10) auto;
  background: #1b1b28;
  padding: 0.01rem 0;
}
.account {
  padding-left: 1.6rem;
}
.mgr {
  padding-left: 0.46rem;
}
.card {
  width: 75%;
  margin: 0 auto;
  margin-bottom: 0.5rem;
  li {
    position: relative;
    display: flex;
    align-items: flex-end;
    width: 100%;
    padding-top: 0.4rem;
    font-size: 0.28rem;
    .name {
      width: 24vw;
      padding-bottom: remCalc(8);
    }
    input {
      border-bottom: 0.01rem solid #3a3d55;
      padding-bottom: remCalc(8);
      outline: none;
      background: none;
      width: 3.2rem;
      color: #ffffff;
      margin-left: remCalc(8);
    }
    .font_acct {
      width: 3.2rem;
      padding-bottom: remCalc(8);
      margin-left: remCalc(8);
    }
  }
}

.time {
  width: 100%;
  margin: 0 auto;
}
.dat {
  padding-left: 0.4rem;
  width: 80%;
  font-size: 0.25rem;
  text-align: left;
}
.dat li {
  margin: 0.1rem auto;
  color: #666669;
  line-height: 1.5;
}
.look {
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: 0.3rem auto;
}
.set,
.record {
  display: 1;
  width: remCalc(312);
  height: remCalc(80);
  line-height: remCalc(80);
  border-radius: 0.4rem;
  text-align: center;
  color: #ffffff;
  font-size: 0.28rem;
}
.set {
  background: linear-gradient(to right, #18cfff, #0db0f2, #018ce4);
}
.record {
  background: linear-gradient(to right, #d1b16c, #c7a764, #be9f5d);
}
</style>

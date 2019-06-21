<template>
  <div class="deposit">
    <headertop class="z99" title="充值台"/>
    <div class="amount">
      <img src="../common/images/yinhangka.png" alt>
      <div>充值金额</div>
      <div>{{amount}}</div>
    </div>
    <div class="bottom">
      <div class="btn confirm" @click="submit">确认</div>
      <router-link class="btn cancel" to="/myself/recharge">取消</router-link>
    </div>
  </div>
</template>
<script>
import { getReCharge } from "../api/interface";
import Headertop from "../components/Header";
export default {
  components: {
    Headertop
  },
  data() {
    return {
      type: this.$route.query.type,
      amount: this.$route.query.amount,
      payPlatId: this.$route.query.payPlatId
    };
  },
  created() {},
  methods: {
    submit() {
      localStorage.setItem("token", this.$route.query.token);
      localStorage.setItem("expireTime", this.$route.query.expireTime);

      let params = {
        type: this.type,
        amount: this.amount,
        payPlatId: this.payPlatId
      };

      getReCharge(params).then(res => {
        if (res.result == 1) {
          this.$toast(res.message);
          if (res.data.success == true) {
            if (res.data.isHtml) {
              document.write(data.data.url);
            } else {
              window.location.href = res.data.url;
            }
          }
        } else if (res.result == 0) {
          this.$toast(res.message);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.deposit {
  .amount {
    width: 80%;
    height: remCalc(200);
    margin: remCalc(100) auto;
    background: #1c1b29;
    display: flex;
    font-size: remCalc(50);
    justify-content: space-around;
    align-items: center;
    border-radius: 10px;
    img {
      filter: grayscale(90%) sepia(100%) hue-rotate(90deg);
    }
    div:nth-child(2) {
      color: #a7f99c;
    }
  }
  .bottom {
    display: flex;
    justify-content: space-evenly;
    .btn {
      width: 38%;
      height: remCalc(100);
      border-radius: 0.5rem;
      font-size: 0.27rem;
      text-align: center;
      line-height: remCalc(100);
      color: #ffffff;
      font-size: remCalc(50);
    }
    .confirm {
        background: linear-gradient(to right, #18cffe, #0fb4f4, #018ee5);
      }
      .cancel{
        background: #b51f49;
      }
  }
}
</style>

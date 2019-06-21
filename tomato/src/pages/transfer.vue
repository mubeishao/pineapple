<template>
  <div class="transfer">
   <Headertop title="户内转账" :isWebView="isWebView"></Headertop>
    <div class="con">
      <!--1-->
      <div class="ct active">
        <div class="one">
          <div>{{fromName}}</div>
          <div>
            <span>余额：</span>
            <h3>￥</h3>
            <h3>
              <h3 v-show="!fromBlanceGetting">{{fromAmount}}</h3>
              <img
                v-show="fromBlanceGetting"
                src="../common/images/loading.gif"
                style="width:0.5rem;height:0.5rem;margin:0 auto"
              >
            </h3>
          </div>
          <!-- <div>
            <span>可转金额：</span>
            <h5>￥</h5>
            <h5 wallet>{{fromAmount}}</h5>
          </div>-->
        </div>
        <div>
          <img src="../common/images/yinhangka.png" alt class="se_game">
        </div>
      </div>
      <!--2-->
      <div class="mid">
        <img class src="../common/images/jiantou.png" alt>
        <div class="active">
          <img src="../common/images/qiehuan.png" @click="changeGame">
        </div>
      </div>
      <!--3-->
      <div class="ct active">
        <div class="one">
          <div>{{toName}}</div>
          <div>
            <span>余额：</span>
            <h3>￥</h3>
            <h3>
              <h3 v-show="!toBlanceGetting">{{toAmount}}</h3>
              <img
                v-show="toBlanceGetting"
                src="../common/images/loading.gif"
                style="width:0.5rem;height:0.5rem;margin:0 auto"
              >
            </h3>
          </div>
          <!--<div>
                <span>可转金额：</span>
                <h5>￥38.05</h5>
          </div>-->
        </div>
        <div>
          <img src="../common/images/yinhangka.png" alt class="se_game">
        </div>
      </div>
      <!--4-->
      <div class="tran">
        <div class="four">
          <input type="number" placeholder="转账金额至少10元,必须是整数" v-model="transferAmount">
          <div class="all" @click="setAll">全部</div>
        </div>
        <div class="kynum">
          <!-- <span>可用金额：</span>
          <h3>￥</h3>
          <h3 wallet>0.42</h3>-->
        </div>
      </div>
      <div class="btn clickBtn" @click="gameTransfer">确认</div>
       <div v-if="isWebView" style="padding-left:0.1rem;margin-top:0.6rem;text-align:center">
        <p class="minSize">
          <i>如若游戏内余额未发生变化，请点击刷新按钮刷新。</i>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import Headertop from "../components/Header";
import { mapState } from "vuex";
import { getBalance, transfer } from "../api/game";

export default {
  data() {
    return {
      isWebView: this.$route.query.isWebView || false, //是否webview

      fromId: 0, //默认中心钱包
      fromName: "大番茄",
      fromAmount: 0, //转出账户余额
      fromBlanceGetting: true, //转出余额获取中...

      toId: this.$route.query.gameId,
      toName: this.$route.query.parentName,
      toAmount: 0, //转入账户余额
      toBlanceGetting: true, ////转入余额获取中...

      transferAmount: null //转入金额
    };
  },
  mounted() {
    this.getGameBlance(this.fromId, true);
    this.getGameBlance(this.toId, false);
  },
  computed: {
    amount() {
      return Number(this.transferAmount);
    }
  },
  methods: {
    //获取游戏余额
    getGameBlance(gameId, isFrom) {
      if (isFrom) {
        this.fromBlanceGetting = true;
      } else {
        this.toBlanceGetting = true;
      }

      getBalance(gameId).then(res => {
        if (res.result == 1) {
          if (isFrom) {
            this.fromAmount = res.data;
            this.fromBlanceGetting = false;
          } else {
            this.toAmount = res.data;
            this.toBlanceGetting = false;
          }
        } else {
          this.$toast(res.message);
        }
      });
    },
    //转入转出交换
    changeGame() {
      let tempid = this.fromId;
      this.fromId = this.toId;
      this.toId = tempid;

      let tempName = this.fromName;
      this.fromName = this.toName;
      this.toName = tempName;
    },
    //设置全部金额
    setAll() {
      this.transferAmount = this.fromAmount;
    },
    //提交，转账
    async gameTransfer() {
      if (this.amount == 0) {
        this.$toast("转账金额不能为空");
        return;
      }
      if (this.amount > this.fromAmount) {
        this.$toast(`${this.fromName}余额不足`);
        return;
      }
      if (this.amount < 10 && this.amount % 10 != 0) {
        this.$toast("转账金额至少10元,必须是整数");
        return;
      }

      let res = await transfer(this.fromId, this.toId, this.amount);
      if (res.result == 1) {
        this.$toast(res.message);
        this.getGameBlance(this.fromId, true);
        this.getGameBlance(this.toId, false);
      } else {
        this.$toast(res.message);
      }
    }
  },
  watch: {
    fromId: function() {
      this.getGameBlance(this.fromId, true);
    },
    toId: function() {
      this.getGameBlance(this.toId, false);
    }
  },
  components: {
    Headertop
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.minSize i {
  font-size: 0.24rem;
  color: #ebb866;
}
input {
  border: none;
  outline: none;
  background: none;
}
.con {
  padding: 0.34rem 0.34rem 0;
  box-sizing: border-box;
}
.con .ct {
  width: 100%;
  height: 2.6rem;
  background: #1b1b26;
  border-radius: 10px;
  padding: 0.5rem 0.34rem 0.34rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
}
.con .ct > div {
  height: 100%;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.con .ct > div img {
  height: 0.6rem;
  width: 0.6rem;
}
.con .ct .one {
  flex: 1;
}
.con .ct .one > div {
  font-size: 0.32rem;
  color: #0fb5f4;
  width: 100%;
  display: flex;
  align-items: center;
  align-content: center;
}
.con .ct .one > div span {
  font-size: 0.24rem;
  color: #6c6c77;
}
.con .ct .one > div h3 {
  font-size: 0.6rem;
  color: #e2e3e5;
  font-weight: 200;
}
.con .ct .one > div h5 {
  font-size: 0.24rem;
  color: #ebb866;
  font-weight: 400;
}
.con .ct .one > div:first-child {
  margin-bottom: 0.3rem;
}
.con .mid {
  width: 100%;
  height: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.con .mid > img:first-child {
  width: 0.7rem;
  height: 0.8rem;
}
.con .mid > div {
  border-radius: 50%;
  background: #15151e;
  width: 0.8rem;
  height: 0.8rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.con .mid > div img {
  width: 0.45rem;
  height: 0.45rem;
}
.con .four {
  margin-top: 0.48rem;
  width: 100%;
  height: 0.9rem;
  display: flex;
  justify-content: space-between;
}
.con .four input {
  border: 2px solid #666666;
  border-radius: 10px;
  flex: 1;
  height: 100%;
  box-sizing: border-box;
  font-size: 0.3rem;
  color: #fff;
  padding: 0 0.3rem;
}
.con .four > div {
  width: 1.06rem;
  height: 0.9rem;
  background: #666666;
  border-radius: 10px;
  font-size: 0.3rem;
  color: #b4b4be;
  line-height: 0.9rem;
  text-align: center;
  margin-left: -0.4rem;
}
.con .kynum {
  padding: 0.15rem 0 0.6rem;
  display: flex;
  padding-left: 0.3rem;
}
.con .kynum span {
  font-size: 0.24rem;
  color: #6c6c77;
}
.con .kynum h3 {
  font-size: 0.24rem;
  color: #ebb866;
  font-weight: 200;
}
.con .btn {
  width: 100%;
  height: 0.8rem;
  background: url("../common/images/button.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 0.32rem;
  color: #fff;
}
.active {
  color: #fff;
  border-top: 1px solid #4e5164;
  border-bottom: 1px solid #4e5164;
  position: relative;
  overflow: hidden;
  ::before {
    content: "";
    background-color: rgba(#7777a5, 0.4);
    border-radius: 100%;
    position: absolute;
    top: 95%;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 #7777a5;
  }
}
</style>
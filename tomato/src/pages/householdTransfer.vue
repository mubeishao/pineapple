<template>
  <div class="transfer">
    <Headertop title="户内转账"></Headertop>
    <section class="section">
      <div class="content">
        <div class="leftcon">
          <div class="top">
            <p>大番茄</p>
            <p>账户余额</p>
          </div>
          <div class="bot">{{pttransferMoNEY}}</div>
        </div>
        <div class="rightcon">
          <div class="top">
            <p>{{parentName}}</p>
            <p>账户余额</p>
          </div>
          <div class="bot">{{ptaccount}}</div>
        </div>
      </div>
      <div class="account">
        <div class="newAccount">
          <div class="orign">
            <p class="origAccount">来源账号</p>
            <p class="orignSel">
              <select v-model="transferFrom">
                <option
                  :value="item.unit"
                  v-for="item in currency"
                  :key="item.unit"
                >{{item.characters}}</option>
              </select>
            </p>
          </div>
          <div class="target">
            <p class="origAccount">目标账号</p>
            <p class="orignSel">
              <select v-model="transferTo">
                <option
                  :value="item.unit"
                  v-for="item in currency"
                  :key="item.unit"
                >{{item.characters}}</option>
              </select>
            </p>
          </div>
        </div>
        <div class="transferNum">
          <p class="origAccount">转账金额</p>
          <input class="limit" type="number" placeholder="转账金额至少10元,必须是整数" v-model="transferAmount">
        </div>
      </div>
      <div class="carry" @click.stop="currentAccount()"></div>
      <div class="reminder">
        <p class="kindly">温馨提示</p>
        <p class="transTP">需要先把资金转入{{parentName}}账户后方可开始游戏</p>
      </div>
    </section>
  </div>
</template>
<script>
import Headertop from "../components/Header";
import { mapState } from "vuex";
import { getGameSum } from "../api/interface";
export default {
  data() {
    return {
      pineCount: 0.0, //大番茄账户余额
      PTCount: 0.0, //PT账户余额
      isShow: false,
      transferAmount: 0,
      transferFrom: 0,
      transferTo: 9,
      gameId: 0,
      ptgameId: 9,
      pttransferMoNEY: 0,
      ptaccount: 0,
      parentName: "",
      currency: [
        {
          unit: 0,
          characters: "大番茄"
        },
        {
          unit: 9,
          characters: "761"
        }
      ]
    };
  },

  mounted() {
    let vm = this;
    //  setTimeout(() => {
    //   this.isShow = true;
    // }, 100);
    vm.transferTo = vm.ptgameId = this.$route.query.gameId;
    vm.parentName = this.$route.query.parentName;
    this.currency[1].unit = vm.ptgameId;
    this.currency[1].characters = vm.parentName;
    this.ptMoney();
    this.ptMoney1();
  },
  computed: {
    ...mapState(["mainInfo"])
  },

  methods: {
    exctionTrans() {
      this.$router.push({ name: "PTAccount" });
    },

    currentAccount() {
      const BASE_URL = this.$CONFIG.BASE_URL+"/Payments";
      const { transferFrom, transferAmount, transferTo } = this;
      this.transferAmount = parseInt(this.transferAmount);
      this.pttransferMoNEY = parseInt(this.pttransferMoNEY);
      this.ptaccount = parseInt(this.ptaccount);

      if (!transferAmount) {
        this.$toast("转账金额不能为空");
        return;
      }
      if (transferAmount < 10 && transferAmount % 10 != 0) {
        this.$toast("转账金额至少10元,且必须是整数");
        return;
      }

      this.$axios
        .post(
          BASE_URL + "/TransferAmountAsync",
          { transferFrom, transferAmount, transferTo },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json"
            }
          }
        )
        .then(res => {
          if (res.data.result === 1) {
            let instance = this.$toast(res.data.message);
            setTimeout(() => {
              instance.close();
            }, 800);
            window.location.reload();
          } else if (res.data.result === 0) {
            this.$toast(res.data.message);
          } else if (res.data.result == -1302) {
            this.$toast(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //其他账户
    async ptMoney1() {
      this.gameId = this.ptgameId;
      let params = {
        gameId: this.gameId
      };
      let res = await getGameSum(params);
      this.ptaccount = res.data;
    },
    //大番茄账户
    async ptMoney() {
      const { gameId } = this;
      let params = {
        gameId
      };
      let res = await getGameSum(params);
      this.pttransferMoNEY = res.data;
    }
  },

  components: {
    Headertop
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";

.transfer {
  width: 100%;
  overflow-x: hidden;
}
.section {
  width: 100%;
  font-size: 0.28rem;
  margin-top: 1.5rem;
}
.show {
  transition: 0.7s;
  transform: translateX(0);
  -webkit-transform: translateX(0);
}
.content {
  width: 100%;
  display: flex;
  margin: 0 auto;
}
.leftcon,
.rightcon {
  flex: 1;
  text-align: center;
  height: 1.4rem;
}
.leftcon {
  border-right: 0.01rem solid #2d3042;
}
.top {
  margin-bottom: 0.4rem;
}
.bot {
  color: #e79902;
}
.account {
  width: 100%;
  height: 3rem;
  background: #171723;
  margin: 0.3rem auto;
}
.newAccount {
  display: flex;
  width: 100%;
  margin: 0 auto;
  padding: 0 0.5rem;
}
.orign,
.target {
  flex: 1;
}
.origAccount {
  width: 84%;
  padding: 0.2rem 0;
  color: #5f6693;
}
.orignSel select {
  width: 70%;
  height: 0.4rem;
  background: #3b405e;
  outline: none;
  border: 0.01rem solid #5e68a6;
  color: #dbdbdb;
  text-align: center;
}

.transferNum {
  width: 100%;
  margin: 0.2rem auto;
  font-size: 0.24rem;
  color: #dbdbdb;
  padding: 0 0.5rem;
}
.limit {
  width: 85%;
  height: 0.46rem;
  line-height: 0.46rem;
  background: #3b405e;
  border: 0.01rem solid #5e68a6;
}
.carry {
  width: 84%;
  height: 0.6rem;
  background: url("../common/images/carry.png") no-repeat;
  background-size: 100% 100%;
  line-height: 0.6rem;
  text-align: center;
  margin-top: 1.6rem;
  border-radius: 0.5rem;
  margin: 0 auto;
  color: #ffffff;
}
.reminder {
  width: 100%;
  margin: 0 auto;
  margin-top: 2rem;
  text-align: center;
  font-size: 0.22rem;
}
.kindly {
  color: #fd0000;
  margin-bottom: 0.2rem;
}
.transTP {
  color: #5f6693;
}
</style>

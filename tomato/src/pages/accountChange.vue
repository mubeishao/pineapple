<template>
  <div class="accountChange">
    <headertop title="账变记录"/>
    <main>
      <div class="data">
        <p>日期</p>
        <p>账变类型</p>
        <p>收入/支出</p>
        <p>账变前</p>
        <p>账变后</p>
      </div>
      <ul v-show="pageArray.length" class="account" v-for="(count,index) in pageArray" :key="index">
        <li>
          <span class="spdate">{{count.createTime|dateformat('MM-DD HH:mm')}}</span>
        </li>
        <li>{{count.flowTypeStr}}</li>
        <li :class="count.amount>0?`income`:'express'">{{count.amount>0?count.amount:count.amount}}</li>
        <li class="color">{{count.originAmount}}</li>
        <li class="color">{{count.finalAmount}}</li>
      </ul>
      <div v-show="pageArray.length<=0" class="norecord">
        <img src="../common/images/norecord.png">
      </div>

      <div class="pation" v-show="pageArray.length">
        <Patitation
          @jumpPage="jumpPage"
          :pageNumber="pageNumber"
          :PageSize="pageSize"
          :totalCount="totalCount"
        />
      </div>
    </main>
  </div>
</template>

<script>
import Headertop from "../components/Header";
import Patitation from "../components/Patitation";
import { GetAccountWallet } from "../api/interface";
export default {
  name: "accountChange",
  data() {
    return {
      accountArr: [],
      pageArray: [],
      pageNumber: 1,
      totalCount: 0,
      pageIndex: 1, //页码
      pageSize: 10 //每页显示的条数
    };
  },
  mounted() {
    //this.accountChange()
    this.getAccount();
  },
  computed: {},
  methods: {
    async jumpPage(e) {
      const { pageSize } = this;
      let params = {
        pageIndex: e.currentPage,
        pageSize
      };
      let res = await GetAccountWallet(params);
      this.pageArray = res.data.walletLogDtos;
    },

    async getAccount() {
      const { pageIndex, pageSize } = this;
      let params = {
        pageIndex,
        pageSize
      };
      this.$indicator.open({
        text: "加载中...",
        spinnerType: "fading-circle"
      });
      let res = await GetAccountWallet(params);
      if (res.result === 1) {
        this.$indicator.close();
        this.pageArray = res.data.walletLogDtos;
        this.totalCount = res.data.totalCount;
      }
    }
  },
  components: {
    Headertop,
    Patitation
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
main {
  padding-top: remCalc(21);
}
.data {
  display: flex;
  text-align: center;
  width: 100%;
  height: 0.8rem;
  line-height: 0.8rem;
  margin: 0 auto 0.1rem auto;
  background: #222126;
}
.norecord {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.norecord img {
  display: block;
  margin-top: 2rem;
  width: 2.6rem;
  height: 2.4rem;
}
.spdate {
  display: block;
}
.data p {
  flex: 1;
  font-size: 0.28rem;
}
.account {
  width: 100%;
  display: flex;
  margin: 0 auto;
  text-align: center;
}
.account li {
  flex: 1;
  height: 0.9rem;
  font-size: 0.24rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1d1d1d;
  border-bottom: 0.01rem solid #2c2c7f;
}
.color {
  color: #d58618;
}
.income {
  color: #7d631a;
}
.express {
  color: #0a7eb0;
}
.pation {
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  position: fixed;
  left: 0;
  bottom: 0;
  background: #171723;
}
</style>

<template>
  <div class="sumbord">
    <headertop title="下级查询"/>
    <div class="pt">
      <div class="query">
        <p class="bord">
          <span>下级查询</span>&nbsp;&nbsp;
          <input placeholder="请输入ID查询" v-model="memId">
        </p>
      </div>
    </div>

    <div class="sumbit clickBtn" @click.prevent="sumbitquery()">提交查询</div>

    <div class="container" v-show="showQuery">
      <h3 class="querylook">查询结果:</h3>
      <ul class="perform">
        <li>恭喜您的团队又壮大了</li>
        <li>
          他的直属上级：
          <span>{{agentArry.parentId}}</span>
        </li>
        <li>
          他的团队人数：
          <span>{{agentArry.teamerCount}}</span>
        </li>
        <li>
          他的今天业绩：
          <span>{{agentArry.todayBet}}</span>
        </li>
        <li>
          他的本周业绩：
          <span>{{agentArry.bet}}</span>
        </li>
        <li>
          他的注册时间：
          <span>{{agentArry.registerDateTime|dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Headertop from "../components/Header";
import { getqueryChild, getSearchChild } from "../api/interface";
export default {
  data() {
    return {
      agentArry: {}, //下级记录
      memId: "",
      todayFeatBet: "",
      thisweekBet: "",
      showQuery: false
    };
  },
  mounted() {
    if (this.$route.query.name) {
      this.memId = this.$route.query.name;
      this.sumbitquery();
    }
  },
  methods: {
    async sumbitquery() {
      const { memId } = this;
      let params = {
        memId
      };
      if (memId == "") {
        return;
      }
      let res = await getSearchChild(params);
      if (res === undefined) {
        this.showQuery = false;
        return;
      }
      if (res.result === 1) {
        this.agentArry = res.data;
        this.showQuery = true;
      } else if (res.result === 0) {
        this.showQuery = false;
        this.$toast(res.message);
      }
    }
  },
  components: {
    Headertop
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.pt {
  padding-top: remCalc(21);
}
.query {
  width: 100%;
  height: 1.2rem;
  line-height: 1.2rem;
  background: #1c1b29;
  margin: 0 0 0.4rem auto;
}
.bord {
  width: 70%;
  margin: 0 auto;
  font-size: 0.24rem;
  text-align: center;
}
.bord input {
  height: 0.5rem;
  line-height: 0.5rem;
  width: 2.2rem;
  background: #13121c;
}
.sumbit {
  width: 50%;
  border-radius: 0.5rem;
  font-size: 0.24rem;
  color: #ffffff;
  margin: 0 auto;
  text-align: center;
  height: 0.7rem;
  line-height: 0.7rem;
  background: linear-gradient(to right, #18cffe, #0fb4f4, #018ee5);
}
input::-webkit-input-placeholder {
  color: #4e5164;
  padding-left: 0.1rem;
}
.record {
  width: 100%;
  height: 5rem;
  overflow: auto;
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
.container {
  width: 100%;
  font-size: 0.24rem;
  color: #989898;
  text-align: center;
  margin: 0.3rem 1rem 0 0;
}
.querylook {
  width: 60%;
  margin: 0 auto;
  font-size: 0.3rem;
  color: #ffffff;
}
.perform {
  text-align: center;
  width: 100%;
  margin: 0 auto;
  padding-left: 1rem;
}
.perform li {
  margin: 0.2rem auto;
  font-size: 0.26rem;
  padding-right: 1.4rem;
  text-align: left;
}
.perform span {
  color: #ffffff;
}
</style>
 
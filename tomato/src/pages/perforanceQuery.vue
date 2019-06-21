<template>
  <div class="performQuery">
    <HeaderTop title="业绩查询"/>
    <div class="todayperformce">
      <table class="table">
        <tr class="team">
          <th colspan="2">
            <p>今日团队佣金</p>
            <p class="zero">{{totalFeat.todayTeamPay}}</p>
          </th>
          <th colspan="2">
            <p>今日团队业绩</p>
            <p class="zero">{{totalFeat.todayTeamBet}}</p>
          </th>
        </tr>
        <tr class="bg-purple">
          <td>
            <p>我的今日佣金</p>
            <p class="zero">{{totalFeat.todaySonPay}}</p>
          </td>
          <td>
            <p>代理的今日佣金</p>
            <p class="zero">{{totalFeat.todayAgentPay}}</p>
          </td>
          <td>
            <p>我的今日直营业绩</p>
            <p class="zero">{{totalFeat.todaySonBet}}</p>
          </td>
          <td>
            <p>代理业绩</p>
            <p class="zero">{{totalFeat.todayAgentBet}}</p>
          </td>
        </tr>
        <tr class="topQuery">
          <td class="hint" colspan="2">
            <p class="message">
              <span>佣金=业绩x返佣额度</span>
            </p>
          </td>
          <td class="hint" colspan="2">
            <p class="hen">
              <span>业绩=游戏中下注输赢金额+充值活动业绩</span>
            </p>
          </td>
        </tr>
      </table>
      <table class="yestarday">
        <tr class="team">
          <th colspan="2">
            <p>昨日团队佣金</p>
            <p class="zero">{{totalFeat.yestodayTeamPay}}</p>
          </th>
          <th colspan="2">
            <p>昨日团队业绩</p>
            <p class="zero">{{totalFeat.yestodayTeamBet}}</p>
          </th>
        </tr>
        <tr class="bg-purple">
          <td>
            <p>我的昨日佣金</p>
            <p class="zero">{{totalFeat.yestodaySonPay}}</p>
          </td>
          <td>
            <p>代理的昨日佣金</p>
            <p class="zero">{{totalFeat.yestodayAgentPay}}</p>
          </td>
          <td>
            <p>我的昨日直营业绩</p>
            <p class="zero">{{totalFeat.yestodaySonBet}}</p>
          </td>
          <td>
            <p>代理昨日业绩</p>
            <p class="zero">{{totalFeat.yestodayAgentBet}}</p>
          </td>
        </tr>
      </table>
    </div>

    <div class="teamCount">
      <p>团队总人数：{{totalFeat.teamNum}}</p>
      <p class="addcount">昨天新增人数：{{totalFeat.yestodayRegisterCount}}</p>
      <p>本月新增人数：{{totalFeat.monthRegisterCount}}</p>
    </div>
    <div class="backprice">
      <div class="toadyMon">
        <p>
          我的今日业绩
          <span>{{totalFeat.todayTeamBet}}</span>元
        </p>
        <p>
          我的本周业绩
          <span>{{totalFeat.thisWeekTeamBet}}</span>元
        </p>
      </div>
      <div class="backMon">
        <p>
          今日返利金额
          <span>{{totalFeat.todaySonPay}}</span>元
        </p>
        <p>
          本周返利金额
          <span>{{totalFeat.thisWeekSonPay}}</span>元
        </p>
      </div>
    </div>
    <div class="querySummery">
      <ul class="summary">
        <li class="directPermce" @click.prevent="myPerformce($event,img1=1,timeType=0)">
          <p class="mypermce">
            我的今日直营业绩
            <span>{{totalFeat.todaySonBet}}</span>元
          </p>
          <p class="down">
            <img :src="rankImg" ref="img1">
          </p>
        </li>
        <transition name="fade" mode="in-out">
          <li class="ranklist" v-show="showpation1">
            <ul>
              <li class="fisrt">
                <p>排名</p>
                <p>昵称</p>
                <p>ID</p>
                <p class="score">业绩(投注/充值)</p>
                <p>佣金</p>
              </li>
              <li class="second" v-for="(agent,index) in agentArry" :key="index">
                <p>{{agent.no}}</p>
                <p class="ellipsis">{{agent.nickName}}</p>
                <p>{{agent.memId}}</p>
                <p class="score">
                  <span class="new">{{agent.bet+agent.payment}}</span>
                  <span>({{agent.bet}}/{{agent.payment}})</span>
                </p>
                <p class="embress">{{agent.pay}}</p>
              </li>
            </ul>
          </li>
        </transition>

        <li class="directPermce" @click="myAgentPerformce($event,img1=2,timeType=0)">
          <p class="mypermce">
            直属代理今日业绩
            <span>{{totalFeat.todaySonTeamBet}}</span>元
          </p>
          <p class="down">
            <img :src="rankImg" >
          </p>
        </li>
        <transition name="fade" mode="in-out">
          <li class="ranklist" v-show="showpation2">
            <ul>
              <li class="fisrt">
                <p>排名</p>
                <p>昵称</p>
                <p>ID</p>
                <p class="score">业绩(投注/充值)</p>
                <p>佣金</p>
              </li>
              <li class="second" v-for="(agent,index) in agentChildArry" :key="index">
                <p>{{agent.no}}</p>
                <p class="ellipsis">{{agent.nickName}}</p>
                <p>{{agent.memId}}</p>
                <p class="score">
                  <span class="new">{{agent.bet+agent.payment}}</span>
                  <span>({{agent.bet}}/{{agent.payment}})</span>
                </p>
                <p class="embress">{{agent.pay}}</p>
              </li>
            </ul>
          </li>
        </transition>

        <li class="directPermce" @click="myPerformce($event,img1=3,timeType=1)">
          <p class="mypermce">
            我的昨日直营业绩
            <span>{{totalFeat.yestodaySonBet}}</span>元
          </p>
          <p class="down">
            <img :src="rankImg" >
          </p>
        </li>
        <transition name="fade" mode="in-out">
          <li class="ranklist" v-show="showpation3">
            <ul>
              <li class="fisrt">
                <p>排名</p>
                <p>昵称</p>
                <p>ID</p>
                <p class="score">业绩(投注/充值)</p>
                <p>佣金</p>
              </li>
              <li class="second" v-for="(agent,index) in agentArry" :key="index">
                <p>{{agent.no}}</p>
                <p class="ellipsis">{{agent.nickName}}</p>
                <p>{{agent.memId}}</p>
                <p class="score">
                  <span class="new">{{agent.bet+agent.payment}}</span>
                  <span>({{agent.bet}}/{{agent.payment}})</span>
                </p>
                <p class="embress">{{agent.pay}}</p>
              </li>
            </ul>
          </li>
        </transition>

        <li class="directPermce"  @click="myAgentPerformce($event,img1=4,timeType=1)">
          <p class="mypermce">
            直属代理昨日业绩
            <span>{{totalFeat.yestodaySonTeamBet}}</span>元
          </p>
          <p class="down">
            <img :src="rankImg">
          </p>
        </li>
        <transition name="fade" mode="in-out">
          <li class="ranklist" v-show="showpation4">
            <ul>
              <li class="fisrt">
                <p>排名</p>
                <p>昵称</p>
                <p>ID</p>
                <p class="score">业绩(投注/充值)</p>
                <p>佣金</p>
              </li>
              <li class="second" v-for="(agent,index) in agentChildArry" :key="index">
                <p>{{agent.no}}</p>
                <p class="ellipsis">{{agent.nickName}}</p>
                <p>{{agent.memId}}</p>
                <p class="score">
                  <span class="new">{{agent.bet+agent.payment}}</span>
                  <span>({{agent.bet}}/{{agent.payment}})</span>
                </p>
                <p class="embress">{{agent.pay}}</p>
              </li>
            </ul>
          </li>
        </transition>

        <li class="directPermce" @click="myPerformce($event,img1=5,timeType=2)">
          <p class="mypermce">
            我的本周直营业绩
            <span>{{totalFeat.thisWeekSonBet}}</span>元
          </p>
          <p class="down">
            <img :src="rankImg" >
          </p>
        </li>
        <transition name="fade" mode="in-out">
          <li class="ranklist" v-show="showpation5">
            <ul>
              <li class="fisrt">
                <p>排名</p>
                <p>昵称</p>
                <p>ID</p>
                <p class="score">业绩(投注/充值)</p>
                <p>佣金</p>
              </li>
              <li class="second" v-for="(agent,index) in agentArry" :key="index">
                <p>{{agent.no}}</p>
                <p class="ellipsis">{{agent.nickName}}</p>
                <p>{{agent.memId}}</p>
                <p class="score">
                  <span class="new">{{agent.bet+agent.payment}}</span>
                  <span>({{agent.bet}}/{{agent.payment}})</span>
                </p>
                <p class="embress">{{agent.pay}}</p>
              </li>
            </ul>
          </li>
        </transition>

        <li class="directPermce" @click="myAgentPerformce($event,img1=6,timeType=2)">
          <p class="mypermce">
            直属代理本周业绩
            <span>{{totalFeat.thisWeekSonTeamBet}}</span>元
          </p>
          <p class="down">
            <img :src="rankImg" >
          </p>
        </li>
        <transition name="fade" mode="in-out">
          <li class="ranklist" v-show="showpation6">
            <ul>
              <li class="fisrt">
                <p>排名</p>
                <p>昵称</p>
                <p>ID</p>
                <p class="score">业绩(投注/充值)</p>
                <p>佣金</p>
              </li>
              <li class="second" v-for="(agent,index) in agentChildArry" :key="index">
                <p>{{agent.no}}</p>
                <p class="ellipsis">{{agent.nickName}}</p>
                <p>{{agent.memId}}</p>
                <p class="score">
                  <span class="new">{{agent.bet+agent.payment}}</span>
                  <span>({{agent.bet}}/{{agent.payment}})</span>
                </p>
                <p class="embress">{{agent.pay}}</p>
              </li>
            </ul>
          </li>
        </transition>

        <li class="directPermce" @click="myPerformce($event,img1=7,timeType=3)">
          <p class="mypermce">
            我的上周直营业绩
            <span>{{totalFeat.lastWeekSonBet}}</span>元
          </p>
          <p class="down">
            <img :src="rankImg" >
          </p>
        </li>
        <transition name="fade" mode="in-out">
          <li class="ranklist" v-show="showpation7">
            <ul>
              <li class="fisrt">
                <p>排名</p>
                <p>昵称</p>
                <p>ID</p>
                <p class="score">业绩(投注/充值)</p>
                <p>佣金</p>
              </li>
              <li class="second" v-for="(agent,index) in agentArry" :key="index">
                <p>{{agent.no}}</p>
                <p class="ellipsis">{{agent.nickName}}</p>
                <p>{{agent.memId}}</p>
                <p class="score">
                  <span class="new">{{agent.bet+agent.payment}}</span>
                  <span>({{agent.bet}}/{{agent.payment}})</span>
                </p>
                <p class="embress">{{agent.pay}}</p>
              </li>
            </ul>
          </li>
        </transition>

        <li class="directPermce" @click="myAgentPerformce($event,img1=8,timeType=3)">
          <p class="mypermce">
            直属代理上周业绩
            <span>{{totalFeat.lastWeekSonTeamBet}}</span>元
          </p>
          <p class="down">
            <img :src="rankImg" >
          </p>
        </li>
        <transition name="fade" mode="in-out">
          <li class="ranklist" v-show="showpation8">
            <ul>
              <li class="fisrt">
                <p>排名</p>
                <p>昵称</p>
                <p>ID</p>
                <p class="score">业绩(投注/充值)</p>
                <p>佣金</p>
              </li>
              <li class="second" v-for="(agent,index) in agentChildArry" :key="index">
                <p>{{agent.no}}</p>
                <p class="ellipsis">{{agent.nickName}}</p>
                <p>{{agent.memId}}</p>
                <p class="score">
                  <span class="new">{{agent.bet+agent.payment}}</span>
                  <span>({{agent.bet}}/{{agent.payment}})</span>
                </p>
                <p class="embress">{{agent.pay}}</p>
              </li>
            </ul>
          </li>
        </transition>
      </ul>
    </div>

    <div class="pation" v-show="showpagetion">
      <Patitation
        @jumpPage="jumpPage"
        :pageNumber="pageNumber"
        :PageSize="PageSize"
        :totalCount="totalCount"
      />
    </div>
  </div>
</template>
<script>
import HeaderTop from "../components/Header";
import { mapState } from "vuex";
import Patitation from "../components/Patitation";
import { getChilds, getfeatsum, getAgentChilds } from "../api/interface";
export default {
  data() {
    return {
      pageIndex: 1, //页码
      pageSize: 10, //每页显示的条数

      pageNumber: 1,
      PageSize: 10,
      totalCount: 0,
      showpation1: false, //是否显示分页
      showpation2: false,
      showpation3: false,
      showpation4: false,
      showpation5: false,
      showpation6: false,
      showpation7: false,
      showpation8: false,

      showRank: false, //是否显示排名
      rankImg: require("../common/images/downquery.png"),
      rankImg2: require("../common/images/upquery.png"),
      totalFeat: {}, //上半部業績
      agentArry: [], //
      agentChildArry: [],
      showImg1: true,
      preveDiv: null,
      img1: "",
      timeType: "",
      showpagetion: false
    };
  },

  mounted() {
    this.perforance();
  },
  methods: {
    async perforance() {
      let res = await getfeatsum();
      if (res.result === 1) {
        this.totalFeat = res.data;
        
      } else if (res.result == 0) {
        this.$toast(res.message);
      }
    },
    async jumpPage(e) {
      const { pageSize, timeType } = this;
      let params = {
        pageIndex: e.currentPage,
        pageSize,
        timeType
      };
      let res = await getChilds(params);
      if (res.result == 1) {
        this.agentArry = res.data.child;
      } else if (res.result == 0) {
        this.$toast(res.message);
      }
    },
    // 表單開關
    pationShow(pre, img1, noData) {
      let downqueryImg = require("../common/images/downquery.png"),
        upqueryImg = require("../common/images/upquery.png");
       pre = pre == upqueryImg ? downqueryImg : upqueryImg;

      let currentShowpation = this[`showpation${img1}`];
      for (let i = 1; i < 9; i++) {
        this[`showpation${i}`] = false;
      }
      if (noData) {
        this.$toast("查无资料");
        return;
      }
      this[`showpation${img1}`] = !currentShowpation;
    },
    async myPerformce(e, img1, timeType) {
      const pre = e.currentTarget.src;

      this.timeType = timeType;

      const { pageIndex, pageSize } = this;
      
      let params = {
        pageIndex,
        pageSize,
        timeType
      };
      let res = await getChilds(params);
      if (res.result == 1) {  
        this.agentArry = res.data.childs;
        this.showpagetion = true;
        this.totalCount = res.data.childsTotalCount;
      } else if (res.result == 0) {
        this.$toast(res.message);
        this.showpagetion = false;
      }
      this.pationShow(pre, img1, !this.totalCount);
    },

    //直属代理
    async myAgentPerformce(e, img1, timeType) {
      const pre = e.currentTarget.src;
      const { pageIndex, pageSize } = this;
      let params = {
        pageIndex,
        pageSize,
        timeType
      };
      let res = await getAgentChilds(params);

      if (res.result == 1) {
        
        this.agentChildArry = res.data.childs;
        this.showpagetion = true;
        this.totalCount = res.data.childsTotalCount;
      } else if (res.result == 0) {
        this.$toast(res.message);
        this.showpagetion = false;
      }
      this.pationShow(pre, img1, !this.totalCount);
    }
  },
  components: {
    HeaderTop,
    Patitation
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.fade-enter {
  opacity: 0;
}
.fade-leave {
  opacity: 1;
}
.fade-enter-active {
  transition: opacity 0.4s;
}
.fade-leave-active {
  opacity: 0;
  transition: opacity 0.4s;
}
.ellipsis {
  text-overflow: ellipsis;
}
.performQuery {
  width: 100%;
  overflow: auto;
  overflow-x: hidden;
  height: auto;
  margin-bottom: 0.6rem;
}
.todayperformce {
  width: 100%;
  height: auto;
  margin: remCalc(21) auto 0.4rem auto;
}

table {
  box-shadow: 2px 8px 5px #151720;
}
.table,
.yestarday {
  width: 100%;
  font-size: 0.24rem;
  color: #dedede;
  border: 0.01rem solid #3b4378;
}

.team th {
  height: 0.4rem;
  line-height: 0.4rem;
  border: 0.01rem solid #3b4378;
  text-align: center;
}
.table td,
.yestarday td {
  height: 0.4rem;
  line-height: 0.4rem;
  border: 0.01rem solid #3b4378;
  text-align: center;
}
.hint {
  vertical-align: middle;
}
.hint img {
  width: 0.2rem;
  height: 0.2rem;
  vertical-align: middle;
}
.hint span {
  color: #8c784f;
}
.message {
  text-align: center;
}
.hen {
  width: 2.4rem;
  text-align: left;
  margin: 0 auto;
}
.zero {
  color: #e0a019;
}
.yestarday {
  margin-top: 0.3rem;
}
.teamCount,
.backprice {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  margin-top: 0.5rem;
}
.teamCount {
  border: 0.01rem solid #3b4378;
  background: #333748;
}
.teamCount p {
  flex: 1;
  font-size: 0.26rem;
  color: #dedede;
  height: 0.7rem;
  line-height: 0.7rem;
}
.addcount {
  border-left: 0.01rem solid #3b4378;
  border-right: 0.01rem solid #3b4378;
}
.backprice {
  margin: 0.2rem auto;
  font-size: 0.26rem;
  background: #171723;
  height: 0.9rem;
}
.backprice span {
  color: #ff0000;
}
.backprice p {
  margin: 0.1rem auto;
}
.toadyMon {
  flex: 1;
  color: #dedede;
  padding-left: 0.3rem;
  text-align: left;
}
.backMon {
  flex: 1;
  padding-right: 0.3rem;
  text-align: right;
}
.backMon p {
  color: #747474;
}
.querySummery {
  width: 100%;
  margin: 0 auto;
  background: #1b1b28;
  padding-bottom: 1.5rem;
}
.summary li {
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  font-size: 0.26rem;
  color: #b1b2b6;
  margin: 0 auto;
}
.down img {
  width: 0.32rem;
  height: 0.2rem;
}
.directPermce {
  height: 1rem;
  line-height: 1rem;
  border-bottom: 0.01rem solid #252538;
}
.directPermce span {
  color: #00ef1c;
}
.summary li.ranklist {
  width: 100%;
  font-size: 0.26rem;

  border-bottom: 0.01rem solid #786b4f;
}
.summary li.fisrt {
  width: 100%;
  background: #232224;
  height: 1rem;
  line-height: 1rem;
}
.summary li.second {
  width: 100%;
  background: #1d1d1d;
  height: 0.8rem;
  line-height: 0.8rem;
}
.ranklist ul {
  width: 100%;
  margin: 0 auto;
  text-align: center;
}
.ranklist > ul > li {
  width: 100%;
}
.fisrt,
.second {
  display: flex;
}
.fisrt p,
.second p {
  flex: 1;
}
.second p {
  margin: 0.1rem auto;
}
.fisrt p.score,
.second p.score {
  flex: 2;
}
.fisrt p.score {
  height: 0.3rem;
}
.second span {
  display: block;
  height: 0.3rem;
}
.new {
  margin-top: -0.16rem;
}
.score,
.embress {
  color: #e18e1b;
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
.bg-purple {
  background: #171723;
}
</style>

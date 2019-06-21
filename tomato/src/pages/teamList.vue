<template>
  <div class="fh">
    <div class="pt">
      <headertop :title="`团队列表-${team}`"/>
      <div class="sticky">
        <div class="search z99">
          <a href="javascripts:;" @click.prevent="getMember(teamInfo)">
            <img src="../common/images/icon_search.png">
          </a>
          <input type="number" placeholder="好友ID" v-model="teamInfo.memId" @change="getMember(teamInfo)">
        </div>
        <div class="team z99">
          <div class="left">
            <div>{{memberInfo.teamerCount}}</div>
            <div>团队人数</div>
          </div>
          <div class="right">
            <div>{{memberInfo.todayRegisterCount}}</div>
            <div>今日新增</div>
          </div>
        </div>
        <div>
          <ul class="info">
            <li>排名</li>
            <li>昵称</li>
            <li>ID</li>
            <li>本周业绩</li>
            <li>团队人数</li>
          </ul>
        </div>
      </div>
      <div class="content">
        <ul v-for="i in memberInfo.child" :key="i.index">
          <li>{{i.no}}</li>
          <li>{{i.nickName}}</li>
          <li>{{i.memId}}</li>
          <li>{{i.teamBet}}</li>
          <li>{{i.teamerCount}}</li>
        </ul>
      </div>
    </div>
    <AlertTip
      :alertText="tip.alertText"
      :placeholderText="tip.holderText"
      :isInput="tip.isInput"
      :isCancel="tip.isCancel"
      v-show="tip.alertShow"
      @cancel="cancel"
      @confirm="confirm"
    />
    <!-- <div class="pation"> -->
    <transition>
      <Patitation
        @jumpPage="jumpPage"
        :pageNumber="pageNumber"
        :PageSize="teamInfo.pageSize"
        :totalCount="totalCount"
      />
    </transition>
    <!-- </div> -->
  </div>
</template>
<script>
import Headertop from "../components/Header";
import { getTeamMembers } from "../api/interface";
import { getSession } from "../common/utils/session";
import AlertTip from "../components/AlertTip";
import Patitation from "../components/Patitation";
export default {
  components: { Headertop, AlertTip, Patitation },
  data() {
    return {
      teamInfo: {
        teamId: "",
        memId: "",
        pageIndex: 1,
        pageSize: 10
      },
      tip: {
        alertShow: false,
        alertText: "",
        isInput: false,
        holderText: "",
        isCancel: false
      },
      team: "",
      memberInfo: {},
      // pageIndex: 1, //页码
      // pageSize: 10, //每页显示的条数
      pageNumber: 1,
      PageSize: 10,
      totalCount: 0,
      pShow: false
    };
  },
  methods: {
    async getMember(params) {
      console.log(params.memId, params.teamId);
      // alert(params.memId, params.teamInfo)
      const res = await getTeamMembers(params);
      
      if (res.result === 1) {
        this.memberInfo = res.data;
        this.totalCount = res.data.childTotalCount;
        // if (this.memberInfo.child.length > 10) {
        //   this.pShow = true;
        // }
      } else {
        this.alertInfo(res.message);
      }
    },
    async jumpPage(e) {
      const { pageSize } = this;
      this.teamInfo.pageIndex = e.currentPage;
      let res = await getTeamMembers(this.teamInfo);
      if (res.result === 1) {
        this.memberInfo = res.data;
        window.scrollTo(0,0)
      } else {
        this.alertInfo(res.message);
      }
    },
    confirm(data) {
      this.cancel();
    },
    alertInfo(alertText, holderText = "", input = false, isCancel = false) {
      this.tip.alertText = alertText;
      this.tip.holderText = holderText;
      this.tip.isInput = input;
      this.tip.isCancel = isCancel;
      this.tip.alertShow = true;
    },
    // 取消彈出視窗
    cancel() {
      this.tip.alertShow = false;
    }
  },
  beforeMount() {
    if (!getSession("team")) {
      this.$router.push({ name: "LayerManagment" });
      return;
    }
    this.team = getSession("team").name;
    this.teamInfo.teamId = getSession("team").id;
  },
  mounted() {
    this.getMember(this.teamInfo);
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.fh {
  height: 100vh;
}

.pt {
  // padding-top: remCalc(21);
  .sticky {
    position: sticky;
    top: remCalc(30);
    z-index: 999999;
    background: #1f212e;
  }
  .search {
    display: flex;
    align-items: center;
    font-size: remCalc(40);
    line-height: remCalc(40);
    height: remCalc(63);
    padding: 0 0 0 0.3rem;
    background: #282a39;
    margin: remCalc(21) auto;
    a {
      width: 0.35rem;
      img {
        padding-top: 4px;
        width: 100%;
      }
    }
    input {
      flex-grow: 1;
      height: remCalc(63);
      position: relative;
      font-size: remCalc(35);
      background: #282a39;
      margin-left: 0.1rem;
    }
    ::-webkit-input-placeholder {
      font-size: remCalc(35);
    }
    ::-moz-placeholder {
      font-size: remCalc(35);
    }
    :-ms-input-placeholder {
      font-size: remCalc(35);
    }
    ::placeholder {
      font-size: remCalc(35);
    }
  }
  .team {
    display: flex;
    background: #282a39;
    width: 100%;
    height: remCalc(85);
    border: 1px solid #3b405e;
    font-size: remCalc(26);
    margin-bottom: 0.15rem;
    .left,
    .right {
      width: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #171723;
      div:nth-child(1) {
        color: #e0a019;
      }
      div:nth-child(2) {
        margin: 2px;
      }
    }
    .left {
      border-right: 1px solid #3b405e;
    }
  }
  .info {
    background: #282a39;
  }
  .content {
    position: relative;
    overflow: scroll;
    height: 10rem;
  }
  ul {
    display: flex;
    font-size: remCalc(30);
    justify-content: center;
    text-align: center;
    padding: 0.15rem 0;
    li {
      width: 20%;
    }
    li:nth-child(1) {
      width: 10%;
    }
  }
}
</style>

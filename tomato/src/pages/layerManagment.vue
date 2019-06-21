<template>
  <div>
    <div class="pt">
      <headertop class="z99" title="排线管理"/>
      <div class="top">
        <input type="text" placeholder="请输入昵称" v-model="name.teamName">
        <div class="button clickBtn" @click="search">搜索</div>
        <div class="button clickBtn" @click="create">二維碼生成</div>
      </div>

      <div class="bottom">
        <div class="box" v-for="i in teamInfo" :key="i.id">
          <div class="advise">
            <div class="name">
              <span @click="revise(i.id)">{{i.name}}</span>
            </div>
            <div class="revise">(点击修改)</div>
            <div class="button clickBtn" @click="shareUrl(i.id)">分享</div>
            <div class="button clickBtn" @click="reset(i.id)">二维码重制</div>
            <div class="button clickBtn" @click="getMember(i.id, i.name)">团队列表</div>
          </div>
          <div class="info">
            <div>{{`团队人数:`+i.number}}</div>
            <div>{{`排线人数:`+i.maxNumber}}</div>
            <div>{{`最新加入:`+i.lastMemId}}</div>
          </div>
        </div>
      </div>
    </div>
    <AlertTip
      :alertText="tip.alertText"
      :placeholderText="tip.holderText"
      :isInput="tip.isInput"
      :isCancel="tip.isCancel"
      :showTip="tip.alertShow"
      :inputCheck="tip.inputCheck"
      @cancel="cancel"
      @confirm="confirm"
    />
  </div>
</template>

<script>
import Headertop from "../components/Header";
import AlertTip from "../components/AlertTip";
import { setSession } from "../common/utils/session";
import {
  getTeamCode,
  getTeamMembers,
  createTeamCode,
  resetTeamCode,
  getShareUrl,
  changeTeamName
} from "../api/interface";
import subordinateVue from "./subordinate.vue";

export default {
  data() {
    return {
      // 彈出
      tip: {
        alertShow: false,
        alertText: "",
        isInput: false,
        holderText: "",
        isCancel: false,
        inputCheck: ""
      },
      // 搜尋結果
      teamInfo: {},
      // 搜尋
      name: {
        teamName: ""
      },
      // 排線名稱修改
      change: {
        name: "",
        id: ""
      },
      // 二維碼生成
      createTeamInfo: {
        name: "",
        maxNumber: Number
      },
      // 二維碼重製&&團隊列表操作
      actId: {
        id: 0
      },
      info: "",
      act:{}
      // isCreate: false,
      // isReset: false,
      // isRevise: false
    };
  },
  methods: {
    // 列表查詢
    search() {
      this.getTeam(this.name);
    },
    // 列表查詢api
    async getTeam(params) {
      const res = await getTeamCode(params);
      if (res.result == 0) {
      } else if (res.result == 1) {
        this.teamInfo = res.data.teamCodes;
      }
    },

    // 修改排線名稱
    async revise(id) {
      this.change.id = id;
      this.alertInfo(
        "修改团队名称",
        "请输入团队名称",
        true,
        true,
        "changeTeamName"
      );
      // this.isRevise = true;
      this.info = "revise";
      await this.next("actRevise");
      
      const res = await changeTeamName(this.change);

      if (res.result == 1) {
        this.getTeam();
        this.alertInfo("修改团队名称成功");
      } else {
        this.alertInfo(res.message);
      }
    },

    // 團隊列表
    async getMember(id, memberName) {
      // const res = await getTeamMembers(this.memberInfo);
      setSession("team", { name: memberName, id });
      this.$router.push({
        name: "TeamList"
      });
    },

    // 二維碼生成按鈕
    async create() {
      // 暱稱為空值
      if (!this.name.teamName) {
        this.alertInfo("请输入团队名称");
        this.tip.alertShow = true;
        return;
      }
      this.createTeamInfo.name = this.name.teamName;
      this.info = "create";
      this.alertInfo(
        "设置排线人数上线",
        "最小人数1人，最大人数2800人",
        true,
        true,
        "teamLimit"
      );
      await this.next("actCreate");
      const res = await createTeamCode(this.createTeamInfo);
      if (res.result === 1) {
        this.getTeam();
        this.alertInfo("操作成功");
      } else {
        this.alertInfo(res.message);
      }
    },

    // 二維碼分享
    async shareUrl(id) {
      this.actId.id = id;
      const res = await getShareUrl(this.actId);
      if (res.result === 1) {
        this.$router.push({
          name: "Subordinate",
          query: {
            url: res.data
          }
        });
      } else {
        this.alertInfo(res.message);
      }
    },

    // 二維碼重製
    async reset(id) {
      this.actId.id = id;
      this.alertInfo("重置后旧的二维码将失效，确定要重置吗?", "", false, true);
      this.info = "reset";
      await this.next("actReset");
      const res = await resetTeamCode(this.actId);
      if (res.result === 1) {
        this.alertInfo("操作成功");
      } else {
        this.alertInfo(res.message);
      }
    },


    // 彈出視窗訊息輸入
    alertInfo(
      alertText,
      holderText = "",
      input = false,
      isCancel = false,
      inputCheck = ""
    ) {
      this.tip.alertText = alertText;
      this.tip.holderText = holderText;
      this.tip.isInput = input;
      this.tip.isCancel = isCancel;
      this.tip.inputCheck = inputCheck;
      this.tip.alertShow = true;
    },
    // 確認鈕
    confirm(data) {
      switch (this.info) {
        // 確認生成
        case "create":
          this.createTeamInfo.maxNumber = data;
          this.act.actCreate();
          break;

        // 確認重置
        case "reset":
          this.act.actReset();
          break;

        // 修改
        case "revise":
          this.change.name = data;
          this.act.actRevise()
          break;
      }

      this.cancel();
    },
    // 取消彈出視窗
    cancel() {
      this.info = "";
      this.tip.alertShow = false;
    },
    // promise物件返回確認
    next(param) {
      return new Promise(res => {
        this.act[param] = () => {
          res();
        };
      });
    }
  },
  mounted() {
    this.getTeam();
  },
  components: {
    Headertop,
    AlertTip
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
.pt {
  // padding-top: remCalc(21);
  .top {
    position: sticky;
    top: remCalc(30);
    margin-top: remCalc(24);
    width: 100%;
    text-align: center;
    // margin-bottom: 0.5rem;
    // width: 100%;
    height: remCalc(124);
    background-color: #1c1b29;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    input {
      display: block;
      width: remCalc(249);
      height: remCalc(65);
      padding: 0 remCalc(20);
      border: 1px solid #3a3d55;
      margin-right: remCalc(13);
      font-size: 0.3rem;
      background-color: #13121c;
      box-sizing: border-box;
    }
    input::placeholder {
      color: #4e5164;
    }
    .button {
      width: 28%;
      height: remCalc(65);
      border-radius: 0.5rem;
      font-size: 0.27rem;
      text-align: center;
      line-height: remCalc(65);
      margin-right: remCalc(9);
      color: #ffffff;
    }
    .button:nth-child(2) {
      background: linear-gradient(to right, #18cffe, #0fb4f4, #018ee5);
    }
    .button:nth-child(3) {
      background: linear-gradient(
        to right,
        #d1b16c 0%,
        #d1b16c 0.4%,
        #bd9e5c 100%
      );
    }
  }
  .bottom {
    width: 95%;
    margin: remCalc(20) auto 0 auto;
    font-size: 0.3rem;
    z-index: 1;
    .box {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: remCalc(143);
      margin-bottom: 0.2rem;
      border: 0.01rem solid #3b4378;
      box-shadow: 0 remCalc(5) 5px 2px #1c1e2a;
      border-radius: 0 0 5px 5px;
      .advise {
        display: flex;
        flex: 1;
        width: 100%;
        justify-content: center;
        align-items: center;
        background: #1c1b29;

        border-bottom: 0.01rem solid #3b4378;
        .name {
          width: 30%;
          text-align: center;
          font-size: remCalc(20);
          white-space: nowrap;
          span {
            font-size: 0.23rem;
            color: #d29f05;
          }
        }
        .revise {
          font-size: 0.18rem;
          width: remCalc(125);
        }
        .button {
          width: 18%;
          height: remCalc(40);
          border-radius: 0.5rem;
          font-size: 0.2rem;
          text-align: center;
          line-height: remCalc(40);
          margin-right: remCalc(9);
          color: #ffffff;
          background: linear-gradient(
            to right,
            #d1b16c 0%,
            #d1b16c 0.4%,
            #bd9e5c 100%
          );
        }
        .button:nth-child(3) {
          width: 10%;
        }
        .button:nth-child(4) {
          width: 22%;
        }
      }
      .info {
        display: flex;
        font-size: 0.2rem;
        align-items: center;
        justify-content: center;
        height: 50%;
        text-align: center;
        div:nth-child(1) {
          width: 30%;
        }
        div {
          padding: 0.2rem 0.2rem;
          width: 35%;
        }
      }
    }
  }
}
</style>



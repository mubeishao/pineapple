<template>
  <div class="myself">
    <div class="header">
      <div class="top">
        <img src="../common/images/back1.png" class="clickBtn" @click.prevent="$router.back()">
        <!-- <img src="../common/images/myset.png" class="myset"> -->
      </div>
      <div class="content">
        <div class="circle" @click.prevent="goBasic">
          <img  v-if='memInfo.headUrl' :src="this.$CONFIG.HEAD_IMAGE_URL+memInfo.headUrl">
        </div>
        <ul class="userInfo">
          <li>昵称:{{memInfo.name}}</li>
          <li>ID:{{memInfo.id}}</li>
          <li>账号余额:{{memInfo.money}}</li>
          <li>上级ID:{{memInfo.parentId}}</li>
        </ul>
        <div
          class="copy clickBtn"
          v-clipboard:copy="memInfo.id"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        >
          <img src="../common/images/copy.png">
        </div>
      </div>
    </div>
    <div class="extra">
      <router-link class="chargeMoney" :to="{name:'ReCharge'}">
        <img src="../common/images/chargem.png">&nbsp;
        <span>充值</span>
      </router-link>
      <p class="transfer" @click.prevent="Coupon()">
        <img src="../common/images/tansferform .png">&nbsp;
        <span>兑换</span>
      </p>
    </div>
    <ul class="authentication">
      <li class="personal" @click.prevent="auther()">
        <div class="firstInfo">
          <p class="left">
            <img src="../common/images/userSelf.png">&nbsp;&nbsp;&nbsp;
            <span>个人认证</span>
          </p>
          <p class="right">
            <img src="../common/images/rightIcon.png">
          </p>
        </div>
      </li>
      <li class="personal" @click.prevent="bindPhone()">
        <div class="firstInfo_num">
          <p class="left_num">
            <img src="../common/images/phoneOne.png" class="spNum">&nbsp;&nbsp;
            <span>绑定手机</span>
          </p>
          <p class="right_num">
            <span class="bindNum">{{memInfo.mobile}}</span>
            <img src="../common/images/rightIcon.png" class="num">
          </p>
        </div>
      </li>
      <li class="personal mgrTop" @click.prevent="gameRecord()">
        <div class="firstInfo">
          <p class="left">
            <img src="../common/images/gamecord.png">&nbsp;&nbsp;&nbsp;
            <span>游戏记录</span>
          </p>
          <p class="right">
            <img src="../common/images/rightIcon.png">
          </p>
        </div>
      </li>
      <li class="personal" @click.prevent="agentCneter()">
        <div class="firstInfo">
          <p class="left">
            <img src="../common/images/agentcenter.png">&nbsp;&nbsp;&nbsp;
            <span>代理中心</span>
          </p>
          <p class="right">
            <img src="../common/images/rightIcon.png">
          </p>
        </div>
      </li>
      <li class="personal" @click.prevent="changesafeCode()">
        <div class="firstInfo">
          <p class="left">
            <img src="../common/images/selfCode.png">&nbsp;&nbsp;&nbsp;
            <span>安全码</span>
          </p>
          <p class="right">
            <img src="../common/images/rightIcon.png">
          </p>
        </div>
      </li>
      <li class="personal" @click.prevent="accountChange()">
        <div class="firstInfo">
          <p class="left">
            <img src="../common/images/transferCode.png" class="imgleft">&nbsp;&nbsp;&nbsp;
            <span>账变记录</span>
          </p>
          <p class="right">
            <img src="../common/images/rightIcon.png">
          </p>
        </div>
      </li>
      <li class="personal mgrTop" @click.prevent="changePassword()">
        <div class="firstInfo">
          <p class="left">
            <img src="../common/images/modifyWord.png">&nbsp;&nbsp;&nbsp;
            <span>修改密码</span>
          </p>
          <p class="right">
            <img src="../common/images/rightIcon.png">
          </p>
        </div>
      </li>
    </ul>
    <div class="safeOut" @click.prevent="safeLogOut">安全退出</div>
    <AlertTip
      :alertText="tip.alertText"
      :placeholderText="tip.holderText"
      :isInput="tip.isInput"
      :isCancel="tip.isCancel"
      v-show="tip.alertShow"
      @cancel="cancel"
      @confirm="confirm"
    />
  </div>
</template>
<script>
import { mapState } from "vuex";
import Storage from "../common/utils/storage";
import { getMemberInfo } from "../api/interface";
import AlertTip from "../components/AlertTip";
export default {
  data() {
    return {
      memInfo: {},
      tip: {
        alertShow: false,
        alertText: "",
        isInput: false,
        holderText: "",
        isCancel: false
      },
      info: "",
      action: "",
      act: {}
    };
  },

  computed: {},
  mounted() {
    this.getInfo();
    this.showAvatar();
  },
  methods: {
    async getInfo() {
      let vm = this;
      let userInfo = await getMemberInfo();
      if (userInfo.result === 1) {
        vm.memInfo = userInfo.data;
        this.headUrl=this.$CONFIG.HEAD_IMAGE_URL+userInfo.data.headUrl;
        Storage.set("userInfo", userInfo.data);
        vm.memInfo.mobile =
          vm.memInfo.mobile.substring(0, 6) +
          "***" +
          vm.memInfo.mobile.substring(9, 11);
      } else if (userInfo.result === 0) {
        this.$toast(userInfo.message);
      }
    },

    async Coupon() {
      this.info = "coupon";
      if (this.memInfo.isBindCard === "True") {
        this.$router.push({ name: "Coupon" });
      } else {
        this.alertInfo("银行卡尚未绑定，确认前往绑定?", "", false, true);
      }
    },
    goBasic() {
      this.$router.push({ name: "basicDocument" });
    },
    onCopy() {
      this.$toast("复制成功");
    },
    onError() {
      this.$toast("复制失败");
    },
    showAlert(alertText) {
      this.alertText = alertText;
      this.alertShow = true;
    },
    auther() {
      this.$router.push({ name: "Authentication" });
    },
    gameRecord() {
      this.$router.push({ name: "GameRecord" });
    },
    // 綁定手機 更改
    async bindPhone(e) {
      this.info = "bindPhone";
      this.alertInfo("是否更换绑定手机号码?", "", false, true);
      await this.next("phone");
      if (this.memInfo.pas == "") {
        setTimeout(() => {
          this.alertInfo("是否綁定安全碼?", "", false, true);
          this.info = "safeCode";
        }, 300);
        await this.next("safeCode");
        this.$router.push({ name: "ChangeSafeCode" });
        return;
      }
      this.$router.push({ name: "BindPhone" });
    },

    alertInfo(alertText, holderText = "", input = false, isCancel = false) {
      this.tip.alertText = alertText;
      this.tip.holderText = holderText;
      this.tip.isInput = input;
      this.tip.isCancel = isCancel;
      this.tip.alertShow = true;
    },

    safeLogOut() {
      this.alertInfo("是否确定要退出?", "", false, true);
      this.info = "logout";
    },
    agentCneter() {
      this.$router.push({ name: "AgentCenter" });
    },
    changesafeCode() {
      this.$router.push({ name: "ChangeSafeCode" });
    },
    changePassword() {
      this.$router.push({ name: "ChangePassword" });
    },
    accountChange() {
      this.$router.push({ name: "AccountChange" });
    },
    confirm(data) {
      switch (this.info) {
        // 安全退出
        case "logout":
          Storage.revome("userInfo");
          Storage.revome("token");
          localStorage.clear()
          this.$router.push({ name: "Login" });
          break;
        // 綁定手機
        case "bindPhone":
          this.act.phone();
          break;
        case "safeCode":
          this.act.safeCode();
          break;
        case "coupon":
          this.$router.push({ name: "Bindbankcard" });
          break;
      }

      this.cancel();
    },

    // 取消彈出視窗
    cancel() {
      this.tip.alertShow = false;
      this.info = "";
    },
    next(param) {
      return new Promise(res => {
        this.act[param] = function() {
          res();
        };
      });
    },
    showAvatar() {
      this.avatarImage =
        Storage.get("userInfo").headUrl !== null
          ? `${this.$CONFIG.HEAD_IMAGE_URL}${Storage.get("userInfo").headUrl}`
          : `${this.$CONFIG.HEAD_IMAGE_URL}default/avatar.png`;
    }
  },
  components: {
    AlertTip
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.myself {
  background-color: #1f212e;
  height: 100vh;
}
.header {
  width: 100%;
  height: 2.6rem;
  background: url("../common/images/mySelfBg.jpg") no-repeat;
  background-size: 100% 100%;
}
.bindNum {
  display: inline-block;
  width: 1rem;
  height: 0.4rem;
  margin-left: 0.7rem;
}

.left img {
  vertical-align: middle;
}
.top {
  width: 93%;
  margin: 0 auto;
  padding-top: remCalc(40);
}
.top img {
  display: block;
  height: 0.3rem;
  width: 0.4rem;
}
.myset {
  float: right;
}
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  height: 1.8rem;
  margin: 0 auto;
  font-size: 0.22rem;
  color: #f6f6f6;
}
.userInfo {
  flex: 2;
  font-size: 0.25rem;
}
.userInfo li {
  margin-bottom: 0.2rem;
}
.circle,
.copy {
  flex: 1;
}
.circle img {
  width: 1rem;
  height: 1rem;
  object-fit: cover;
  object-position: top center;
  border-radius: 50%;
}
.copy img {
  width: 1rem;
  height: 0.36rem;
  margin-bottom: 0.6rem;
}
.extra {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #191947;
  font-size: 0.36rem;
  border: 0.02rem solid #2c2c7f;
  height: 0.8rem;
  line-height: 0.8rem;
}
.extra img {
  width: 0.36rem;
  height: 0.36rem;
  object-fit: cover;
  vertical-align: middle;
}
.extra span {
  vertical-align: middle;
  color: #bd9e5c;
}
.chargeMoney,
.transfer {
  flex: 1;
  text-align: center;
}
.chargeMoney {
  border-right: 0.02rem solid #2c2c7f;
}
.authentication {
  width: 100%;
  margin-top: 0.2rem;
  font-size: 0.3rem;
}
.authentication li {
  // height: 0.8rem;
  // line-height: 0.8rem;
  height: remCalc(120);
  line-height: remCalc(120);
  background: #1b1b28;
  margin-bottom: 0.02rem;
  vertical-align: middle;
}
.authentication img {
  width: 0.36rem;
  object-fit: cover;
}
.right img,
.right_num img {
  width: 0.24rem;
  object-fit: cover;
  vertical-align: middle;
}
.right_num img {
  display: inline-block;
}
.firstInfo,
.firstInfo_num {
  display: flex;
  width: 90%;
  height: 100%;
  margin: 0 auto;
}
.left {
  flex: 4;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
  display: flex;
}
.right {
  flex: 1;
  justify-content: flex-end;
  align-items: flex-end;
  text-align: right;
}
.left_num {
  flex: 2;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
}
.right_num {
  flex: 2;
  justify-content: center;
  align-items: center;
  text-align: right;
}
.num {
  padding-left: 0.84rem;
}
.mgrTop {
  margin-top: 0.2rem;
}
.spNum {
  vertical-align: middle;
}
.safeOut {
  width: 100%;
  height: remCalc(120);
  line-height: remCalc(120);
  text-align: center;
  background: #940303;
  color: #ffffff;
  font-size: 0.28rem;
  margin-top: 0.6rem;
  background: #940203;
}
</style>

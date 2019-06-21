<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
  <div class="chargePage">
    <Headertop title="充值中心"/>
    <main>
      <div class="chargeType">
        <div class="payoff" v-for="(type,index) in payType" :key="index">
          <div
            class="ficial clickBtn"
            @click="go(index,type.id)"
            :class="typeIndex==index?'chargeBJ':'noBJ'"
          >
            <span>
              <img src="../common/images/serverline.png">
            </span>
            {{type.name}}
          </div>
        </div>
      </div>
      <div class="rechargeman" v-if="ChannelArr.length>0" v-show="false">
        <div class="content">
          <div class="writting">
            <div class="write">
              <p>
                <span>以下联系方式均为平台账号,充值系统不稳定时可以使用人工充值。</span>
                <span class="please">添加任意一个客服的QQ或者微信,可以在10秒内帮您完成充值</span>
              </p>
            </div>
            <div class="brunsh">
              <img
                src="../common/images/brunsh.png"
                @click.prevent="brunsh($event)"
                ref="brunsh"
                class="bang"
              >
            </div>
          </div>
        </div>
        <div>
          <div class="copy">
            <div class="first">
              <p class="qqIcon">
                <img src="../common/images/qqicon.png">
                <span class="number">{{qqNum}}</span>
                <span
                  class="copywrite"
                  v-clipboard:copy="qqNum"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >复制</span>
              </p>
              <p class="weixinIcon">
                <img src="../common/images/weixin.png">
                <span class="numCard">{{bandCard}}</span>
                <span
                  class="copywrite"
                  v-clipboard:copy="bandCard"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >复制</span>
              </p>
            </div>
            <div class="first firstqq">
              <p class="qqIcon">
                <img src="../common/images/qqicon.png">
                <span class="number">3200508025</span>
                <span class="copywrite">复制</span>
              </p>
              <p class="weixinIcon">
                <img src="../common/images/weixin.png">
                <span class="numCard">银行卡代充</span>
                <span class="copywrite">复制</span>
              </p>
            </div>
          </div>
          <div class="copy">
            <div class="first">
              <p class="qqIcon">
                <img src="../common/images/qqicon.png">
                <span class="number">3200508025</span>
                <span class="copywrite">复制</span>
              </p>
              <p class="weixinIcon">
                <img src="../common/images/weixin.png">
                <span class="numCard">银行卡代充</span>
                <span class="copywrite">复制</span>
              </p>
            </div>
            <div class="first firstqq">
              <p class="qqIcon">
                <img src="../common/images/qqicon.png">
                <span class="number">{{qqNum}}</span>
                <span
                  class="copywrite"
                  v-clipboard:copy="qqNum"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >复制</span>
              </p>
              <p class="weixinIcon">
                <img src="../common/images/weixin.png">
                <span class="numCard">{{bandCard}}</span>
                <span
                  class="copywrite"
                  v-clipboard:copy="bandCard"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >复制</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="rechargeContent">
        <div class="chargeSec">
          <img src="../common/images/selectcharge.png">
        </div>
        <div class="artificial2">
          <div class="zfubao" v-for="(wx,index) in ChannelArr" :key="index">
            <div
              @click="wxchangeBj(index,wx.id)"
              :class="wxIndex==index ?'chargeBJ2 ficial2':'noBJ ficial4'"
              class="clickBtn"
            >
              <span>
                <img src="../common/images/zhifubao.png">
              </span>
              {{wx.name}}
            </div>
          </div>
        </div>
        <div class="sumTypeNum" v-show="payRule.length>0">
          <div class="type1" v-for="(wxsum,index) in payRule" :key="index">
            <p
              :class="wxNumIndex==index?'gradebj':'nograde'"
              @click="chargelistWx($event,index)"
            >{{wxsum}}</p>
          </div>
          <div class="selSumbit clickBtn" @click.stop="getChargePay()">
            充值提交
            <!-- <img src="../common/images/selSumbit.png" > -->
          </div>
        </div>
        <div class="nodata" v-show="payRule.length==0">暂无支付渠道</div>
      </div>
    </main>
  </div>
</template>


<script>
import {
  getReCharge,
  getPayType,
  getChannel,
  getPayRule
} from "../api/interface";
import Headertop from "../components/Header";
export default {
  data() {
    return {
      type: 1, //充值类型
      amount: 0,
      showBJ: true,
      qqNum: "3200508025",
      bandCard: "银行卡代充",
      preveDiv: null,
      preveDivlist: null,
      preveDives: null,
      showIndex: 0,
      wxIndex: 0,
      fastIndex: 0,
      sumIndex: 0,
      wxNumIndex: 0,
      fastNumIndex: 0,
      weixinShow: false,
      showRechargeText: false, //展示各个充值内容
      arrTarget: true,
      fastpay: false,
      payType: [],
      payRule: [],
      ChannelArr: [],
      typeIndex: 0,
      payChannId: 0,
      payTypeNum: "",
      channelId: "",
      paytypeId: 0,
      r: 0 //图片旋转角度
    };
  },
  mounted() {
    let vm = this;
    this.getPayType();
    // vm.brunsh()
  },

  methods: {
    brunsh() {
      this.r -= 360;
      this.$refs.brunsh.style.transform = "rotate(" + this.r + "deg)";
    },

    async getPayType() {
      let res = await getPayType();
      if (res.result == 1) {
        this.payType = res.data;
      } else if (res.result == 0) {
        this.$toast(res.message);
      }
    },

    //点击获取支付渠道方式
    async getChannel(channelId) {
      let vm = this;
      vm.wxNumIndex = 0;

      let params = {
        channelId
      };
      let res = await getChannel(params);

      if (res.result == 1) {
        this.ChannelArr = res.data;

        if (this.ChannelArr.length > 0) {
          vm.channelId = this.ChannelArr[0].id;
          vm.getPayRule(this.ChannelArr[0].id, channelId);
        } else {
          vm.payRule = "";
        }
      } else if (res.result == 0) {
        this.$toast(res.message);
      }
    },

    async getPayRule(payPlatId, channelId) {
      let vm = this;
      let params = { payPlatId, channelId };
      let res = await getPayRule(params);

      if (res.result == 1) {
        this.payRule = res.data;

        vm.amount = vm.payRule[0];
      } else if (res.result == 0) {
        this.$toast(res.message);
      }
    },

    wxchangeBj(index, wxid) {
      let vm = this;
      this.wxNumIndex = 0;
      this.wxIndex = index;
      // let PlatId =vm.channelId;
      let playId = vm.payChannId;
      vm.channelId = wxid;
      this.getPayRule(wxid, playId);
    },

    chargelistWx(e, indexs) {
      let vm = this;
      vm.amount = e.target.innerHTML;
      vm.wxNumIndex = indexs;
    },
    async getChargePay() {
      var url = window.location.origin+"/deposit?";
      var params = "type=" + this.payChannId + "&amount=" + this.amount + "&payPlatId=" + this.channelId
                    +"&token="+localStorage.getItem("token")+"&expireTime="+encodeURI(localStorage.getItem("expireTime"));

      if(isApp){
         alert(url+params);
         plus.runtime.openURL(url + params);//调用浏览器打开网址
      }else{
        alert("oo");
        window.location.href=url+params;
      }
    },

    go(indexs, typeId) {
      let vm = this;
      vm.wxIndex = 0;
      vm.typeIndex = indexs;
      this.payChannId = typeId;
      vm.getChannel(typeId);
    },

    onCopy() {
      this.$toast("复制成功");
    },
    onError() {
      this.$toast("复制失败");
    }
  },
  components: {
    Headertop
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";

main {
  margin-top: remCalc(21);
}

.zfubao {
  width: 46%;
}
.nodata {
  font-size: 0.34rem;
  margin-top: 1rem;
}

.chargeType {
  width: 98%;
  margin: 0 auto;
  margin-bottom: 0.3rem;
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  text-align: center;
  flex-wrap: wrap;
}
.artificial2 {
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  text-align: center;
  flex-wrap: wrap;
  width: 100%;
  margin: 0 auto;
}

.artificial {
  width: 100%;
  height: 0.5rem;
  line-height: 0.5rem;
  margin: 0 auto;
  text-align: center;
}
.payoff {
  width: 31%;
  padding-left: 0.1rem;
}
.payoff2 {
  display: flex;
}
.payoff2 {
  width: 98%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
  align-items: center;
  color: #5a5a5a;
}

.rechargeContent .ficial2 {
  height: 0.6rem;
  line-height: 0.6rem;
  font-size: 0.28rem;
  margin-bottom: 0.2rem;
  border-radius: 0.24rem;
  border: 0.01rem solid #82765b;
  color: #ffffff;
}
.ficial4 {
  height: 0.6rem;
  line-height: 0.6rem;
  font-size: 0.28rem;
  margin-bottom: 0.2rem;
  border-radius: 0.24rem;
  border: 0.01rem solid #82765b;
}
.ficial3 {
  width: 46%;
  height: 0.6rem;
  line-height: 0.6rem;
  font-size: 0.28rem;
  margin-bottom: 0.2rem;
  border-radius: 0.24rem;
  border: 0.01rem solid #82765b;
}

.ficial {
  height: auto;
  border: 1px solid #555871;
  border-radius: 0.24rem;
  margin: 0.1rem auto;
  background: #1f212e;
  padding: 0.1rem 0;
}

.ficial img,
.ficial2 img,
.ficial3 img,
.ficial4 img,
.pay img {
  width: 0.3rem;
  height: 0.3rem;
  vertical-align: middle;
}

.ficial,
.pay {
  color: #a5a5a5;
  font-size: 0.25rem;
}
.chargeSec {
  width: 100%;
  margin: 0.6rem auto;
}
.chargeSec img {
  height: 0.3rem;
  width: 100%;
}
.tical {
  vertical-align: middle;
  color: #a5a5a5;
}
.tical2 {
  color: #83839e;
}
.payment {
  width: 100%;
  height: auto;
  display: flex;
  padding-left: 1.2%;
  margin-top: 0.1rem;
}
.pay {
  flex: 0 0 30%;
  border: 1px solid #555871;
  border-radius: 0.24rem;
}
.margin {
  margin-left: 3%;
}
.chargeBJ {
  transition: 0.6s;
  background: #bd9e5c;
  color: #1e1e36;
}
.chargeBJ2 {
  background: #bd9e5c;
  color: #ffffff;
}

.BJimg {
  width: 0.3rem;
  height: 0.3rem;
  vertical-align: middle;
}

.noBJ {
  transition: 0.6s;
  background: #171723;
  color: #a5a5a5;
}
.fontbj {
  color: #ffffff;
}
.content {
  width: 100%;
  line-height: 1.3rem;
  text-align: center;
  background: #171723;
}
.writting {
  display: flex;
  width: 94%;
  text-align: center;
  justify-content: space-between;
  font-size: 0.3rem;
  margin: 0 auto;
  padding: 0.2rem 0;
}
.write {
  width: 80%;
  font-size: 0.22rem;
}
.write p {
  text-align: left;
  line-height: 0.3rem;
  display: block;
}
.write p span {
  display: block;
}
.brunsh {
  flex-grow: 1;
  display: flex;
}
.brunsh img {
  margin: auto;
  height: 0.6rem;
  transition: all 2s;
}
.miao {
  text-align: left;
  color: #ab8a44;
}
.please {
  padding-top: 0.1rem;
  color: #ab8a44;
}

.copy {
  width: 94%;
  margin: 0.2rem auto;
  display: flex;
}
.first {
  height: 1.5rem;
  flex: 1;
  font-size: 0.22rem;
  color: #4e5164;
  overflow: hidden;
  background: #1b1b27;
  border-radius: 0.1rem;
  text-align: left;
}
.firstqq {
  margin-left: 0.14rem;
}
.first img {
  width: 0.4rem;
  height: 0.4rem;
  vertical-align: middle;
}
.qqIcon,
.weixinIcon {
  padding-left: 0.14rem;
  height: 0.5rem;
  line-height: 0.5rem;
}
.qqIcon {
  margin-top: 0.18rem;
}
.number {
  padding-right: 5%;
}
.numCard {
  padding-right: 12%;
}
.copywrite {
  background: #ab8a44;
  color: #ffffff;
  height: 0.2rem;
  width: 0.4rem;
  border-radius: 0.14rem;
  padding: 0 0.14rem;
}
.weixinIcon {
  margin-top: 0.1rem;
}
.rechargeContent {
  width: 96%;
  margin: 0 auto;
  font-size: 0.26rem;
  text-align: center;
  margin-bottom: 1.3rem;
}
.amount {
  width: 90%;
  height: 0.4rem;
  line-height: 0.4rem;
  font-size: 0.24rem;
  color: #83839e;
  text-align: left;
  margin: 0 auto;
}
.sumTypeNum {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  margin: 0 auto;
  padding-top: 0.3rem;
}

.type1 {
  width: 23%;
  height: 0.6rem;
  line-height: 0.6rem;
  text-align: center;
  color: #7a7a79;
  border-radius: 0.04rem;
  margin-bottom: 0.3rem;
  margin-left: 0.1rem;
  margin-top: 0.2rem;
}
.nograde {
  background: #e6e6e6;
}
.gradebj,
.gradebj2,
.gradebj3 {
  color: #000000;
  border: 0.01rem solid #bd9e5c;
  background: linear-gradient(#ead7b3, #ecdfc5, #f2f2f2);
  background: -moz-linear-gradient(#ead7b3, #ecdfc5, #f2f2f2);
  background: -webkit-linear-gradient(#ead7b3, #ecdfc5, #f2f2f2);
}
.chargeM {
  background: #e6e6e6;
  border: 0.01rem solid #81819c;
}
.selSumbit {
  // width: 100%;
  // margin: 0.4rem auto;
  width: 75%;
  height: 0.7rem;
  line-height: 0.7rem;
  text-align: center;
  color: #ffffff;
  font-size: 0.28rem;
  margin: 0.8rem auto;
  border-radius: 0.4rem;

  background: linear-gradient(to right, #18cfff, #0db0f2, #018ce4);
  background: -moz-linear-gradient(to right, #18cfff, #0db0f2, #018ce4);
  background: -o-linear-gradient(to right, #18cfff, #0db0f2, #018ce4);
  background: -webkit-linear-gradient(to right, #18cfff, #0db0f2, #018ce4);
}
.selSumbit img {
  object-fit: cover;
  display: block;
  height: 0.7rem;
  width: 100%;
}
</style>



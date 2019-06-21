<template>
  <div class="share">
    <header-top title="大番茄"/>
    <main>
      <div class="top_area">
        <span>抽奖次数：{{changeCount}}</span>
        <span class="red">（抽奖次数，每日0点清空）</span>
      </div>
      <div class="roulette_area">
        <img class="roulette" ref="roller" src="~@/common/images/roulette/roll.png" alt>
        <img src="~@/common/images/roulette/effect.png" alt class="effect" v-show="!isRolling">
        <img class="arrow" src="~@/common/images/roulette/fixed.png">
        <a hhref="javascript:;" class="start" @click.prevent="draw"></a>
      </div>
      <div class="share_area">
        <a
          href="javascript:;"
          class="block download clickBtn"
          v-clipboard:copy="downloadUrl"
          v-clipboard:success="onCopy"
        >
          <canvas ref="canvas"></canvas>
        </a>
        <a href="javascript:;" class="block friend clickBtn"></a>
        <a href="javascript:;" class="block wechat clickBtn"></a>
      </div>
      <div class="bottom_area">
        <p>温馨提示：</p>
        <ol>
          <li>每天首次分享可获得抽奖机会，达到{{validBetAmount}}有效投注后，即可参与抽奖</li>
         
        </ol>
        <p class="blue">小TIPS:代理发展代理或者开小号玩游戏能获得更多佣金收益哦</p>
        <router-link class="btn clickBtn" :to="{name:'PerforanceQuery'}">查看佣金收益</router-link>
      </div>
    </main>
    <div class="winner_area" v-if="winning.show">
      <div class="bg"></div>
      <div class="winner" :style="`background-image: url(${winning.image});`">
        <div class="result" :class="winning.WL" v-html="winning.result"></div>
        <div class="deco">{{winning.decoText}}</div>
        <a class="cancel" href="#" @click.prevent="cancel"></a>
      </div>
    </div>
    <div class="nocount_area" v-if="NoCountMessage">
      <div class="bg"></div>
      <div class="nocount">
        <div class="counts">抽奖次数：{{changeCount}}</div>
        <div class="result" :class="winning.WL">{{NoCountMessage}}</div>
        <a class="cancel" href="#" @click.prevent="cancel"></a>
      </div>
    </div>
  </div>
</template>
<script>
import headerTop from "@/components/Header";
import AlertTip from "@/components/AlertTip";
import { TimelineLite } from "gsap";
import QrCodeWithLogo from "qr-code-with-logo";
import LocalImage from "@/common/images/DBLIcon.png";
import { getPrizeAboutInfo, luckDraw, getReferralCode } from "../api/interface";
const timeline = new TimelineLite();

export default {
  components: {
    headerTop,
    AlertTip
  },
  data() {
    return {
      changeCount: 0,
      validBetAmount: 0,
      NoCountMessage: "", // 不能轉的話跳出信息
      result: "",
      isRolling: false,
      result: {
        alertShow: false,
        alertText: "結果",
        isCancel: false,
        events: ""
      },
      winning: {
        show: false,
        image: require("@/common/images/roulette/winning.png"),
        WL: "lose",
        result: "再接<br/>再厉",
        decoText: "谢谢参与"
      },
      downloadUrl: "https://www.nasa.gov/",
      shareLink: {
        discription: ""
      }
    };
  },
  mounted() {
    getPrizeAboutInfo().then(res => {
      if (res.result !== 1) return false;
      this.changeCount = res.data.changeCount;
      this.validBetAmount = res.data.validBetAmount;
    });

    this.getQrcodeUrl();
    this.createQRcode(this.downloadUrl);
  },
  methods: {
    //result tip
    resultSetting(obj) {
      obj.show = true;
      obj.WL = obj.WL ? obj.WL : "win";
      obj.image = require("@/common/images/roulette/winning.png");
      this.winning = obj;
    },
    cancel(obj) {
      this.winning.show = false;
      this.NoCountMessage = "";
    },
    rand(min, max) {
      return Math.floor(Math.random() * max + min);
    },
    //抽獎彈窗 confirm執行轉盤
    draw() {
      if (this.isRolling) return false; //
      const { roller } = this.$refs;
      timeline.to(roller, 0, { clearProps: "rotation" });
      luckDraw().then(res => {
        if (res.result !== 1) {
          this.NoCountMessage = res.message;
          return;
        }
        this.rotate(this.rand(2, 5), res.data);
      });
    },
    // 旋轉轉盤
    rotate(duration = 5, res) {
      const { roller } = this.$refs;
      this.isRolling = true;
      timeline
        .to(roller, duration, {
          rotation: (res.prizeId - 1) * 45 + duration * 360 * 3,
          ease: Back.easeOut.config(0.3)
        })
        .eventCallback("onComplete", () => {
          this.showReward(res);
        });
    },
    showReward(res) {
      this.isRolling = false;
      this.winning.show = true;
      let result, decoText, WL;

      switch (res.prizeId) {
        case 0:
          result = "再接<br/>再厉";
          decoText = "谢谢参与";
          WL = "lose";
          break;
        default:
          result = res.prizeName;
          result =
            result.match(/\d+/g).join("") +
            "<br/>" +
            result.match(/[^\d+]/g).join("");
          decoText = "恭喜您获得";
          WL = "win";
          break;
      }
      this.resultSetting({
        WL,
        result,
        decoText
      });
      this.changeCount = res.changeCount;
    },
    async getQrcodeUrl() {
      const referralCode = await getReferralCode();
      this.downloadUrl = referralCode.data;
    },
    createQRcode(url) {
      const { canvas } = this.$refs;
      QrCodeWithLogo.toCanvas({
        canvas,
        content: url,
        logo: {
          src: LocalImage,
          radius: 8
        }
      });
    },
    onCopy: function(e) {
      this.$toast("复制成功");
    },
    setupWebViewJavascriptBridge() {}
    // shareQQLink() {
    //   window.location.href = `mqqapi://share/to_fri?file_type=text&file_data=aHR0cHM6Ly93d3cuYmFzZTY0ZW5jb2RlLm9yZy8=&generalpastboard=1&src_type=app&version=1&callback_type=scheme&shareType=0&title=5aSn5rOi576F&thirdAppDisplayName=U2hhcmVTREtEZW1v&callback_name=QQ05FB8B52&objectlocation=pasteboard&cflag=0&sdkv=3.2.1`;
    // }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.share {
  width: 100%;
  height: 100vh;
  background-image: url("~@/common/images/roulette/shareMoney_bg.png");
  background-size: cover;
  background-position: center;
  overflow: scroll;
}
main {
  z-index: -1;
  font-size: remCalc(26);
  padding-bottom: remCalc(120);
  overflow: hidden;
}
.top_area {
  padding-top: remCalc(21);

  text-align: center;
  span {
    color: #f9ab03;
  }
  .red {
    margin-left: 0.4rem;
    color: #d02c37;
  }
}
.roulette_area {
  position: relative;
  padding-top: remCalc(27);
  width: 130%;
  margin: 0 -15%;
  margin-top: -15%;
  pointer-events: none;
  .roulette {
    width: 100%;
  }
  .arrow {
    position: absolute;
    top: remCalc(27);
    left: -1px;
    width: 100%;
  }
  .effect {
    position: absolute;
    top: remCalc(27);
    left: -1px;
    width: 100%;
  }
  .start {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 23vw;
    height: 23vw;
    pointer-events: initial;
  }
}
.bottom_area {
  width: 90%;
  margin: 0 5%;
  font-size: remCalc(24);
  line-height: 1.5;
  .blue {
    color: #0693ec;
  }
  li {
    color: #575b7a;
  }
  .btn {
    display: block;
    margin: remCalc(15) auto;
    padding: remCalc(15) 0;
    width: 70%;
    text-align: center;
    font-size: remCalc(32);
    color: #ffffff;
    background-color: #e09603;
    border-radius: 3rem;
  }
}
.winner_area {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  .bg {
    position: absolute;
    z-index: -1;
    width: 100vw;
    height: 100vh;
    background-color: #000;
    opacity: 0.7;
  }
  .winner {
    margin-top: remCalc(250);
    margin-left: -8vw;
    width: 110vw;
    height: calc(110vw * 541 / 771);
    background-size: cover;
    position: relative;
    .result {
      position: absolute;
      top: remCalc(210);
      left: calc(50% + 4.5vw);
      transform: translateX(-50%);
      font-size: remCalc(80);
      letter-spacing: 5px;
      line-height: 1.1;
      text-align: center;
      &.lose {
        color: #a0a0a0;
      }
      &.win {
        color: #d02c37;
      }
    }
    .deco {
      position: absolute;
      bottom: remCalc(25);
      left: calc(50% + 3vw);
      transform: translateX(-50%);
      font-size: remCalc(48);
      color: #fff5ce;
    }
    .cancel {
      display: block;
      position: absolute;
      bottom: -20vh;
      left: calc(50% + #{remCalc(26.5)});
      transform: translateX(-50%);
      width: remCalc(53);
      height: remCalc(53);
      padding: remCalc(60);
      background-image: url("~@/common/images/roulette/cancel.png");
      background-repeat: no-repeat;
      background-size: remCalc(53);
      background-position: center;
      box-sizing: border-box;
    }
  }
}
.nocount_area {
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;
  .bg {
    position: absolute;
    z-index: -1;
    width: 100vw;
    height: 100vh;
    background-color: #000;
    opacity: 0.7;
  }
  .nocount {
    margin-top: remCalc(250);
    margin-left: -11vw;
    width: 110vw;
    height: calc(110vw * 541 / 771);
    background-image: url("~@/common/images/roulette/outOfDrawTimes.png");
    background-size: cover;
    position: relative;
    .counts {
      position: absolute;
      top: remCalc(180);
      left: calc(50% + 7vw);
      transform: translateX(-50%);
      font-size: remCalc(40);
      letter-spacing: 5px;
      line-height: 1.1;
      text-align: center;
      color: #d02c37;
    }
    .result {
      position: absolute;
      top: remCalc(280);
      left: calc(50% + 7.5vw);
      transform: translateX(-50%);
      font-size: remCalc(24);
      width: 30%;
      letter-spacing: 1px;
      line-height: 1.3;
      color: #575b7a;
    }
    .cancel {
      display: block;
      position: absolute;
      bottom: -20vh;
      left: calc(50% + #{remCalc(50)});
      transform: translateX(-50%);
      width: remCalc(53);
      height: remCalc(53);
      padding: remCalc(60);
      background-image: url("~@/common/images/roulette/cancel.png");
      background-repeat: no-repeat;
      background-size: remCalc(53);
      background-position: center;
      box-sizing: border-box;
    }
  }
}
.share_area {
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: 0 auto;
  margin-top: -7vh;
  margin-bottom: remCalc(40);
  .block {
    display: block;
    height: remCalc(138);
    width: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin: 0 remCalc(5);
    z-index: 1;
    &.download {
      background-image: url("~@/common/images/roulette/download.png");
    }
    &.friend {
      background-image: url("~@/common/images/roulette/friend.png");
    }
    &.wechat {
      background-image: url("~@/common/images/roulette/wechat.png");
    }
    canvas {
      width: remCalc(80) !important;
      height: auto !important;
      margin-left: 20%;
      margin-top: 3%;
    }
  }
}
</style>

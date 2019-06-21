<template>
  <main>
    <header>
      <a href="#" @click.prevent="goback()">
        <img src="~@/common/images/close.png" class="close">
      </a>
    </header>
    <div class="wrap">
      <img src="~@/common/images/QR_C.png" class="qr_background">
      <canvas class="qrcode"></canvas>
    </div>
    <div class="linkbar">
      <div class="link">
        <p>{{qrcodeImgUrl}}</p>
      </div>
      <div class="copylink clickBtn">
        <a href="javascript:;"  v-clipboard:copy="qrcodeImgUrl" v-clipboard:success="onCopy">复制连接</a>
      </div>
    </div>
  </main>
</template>
<script>
import QrCodeWithLogo from "qr-code-with-logo";
import LocalImage from "@/common/images/DBLIcon.png";
import { getReferralCode } from "../api/interface";
export default {
  data() {
    return {
      qrcodeImgUrl: ""
    };
  },
  mounted() {
    // 是否排線碼分享
    if (this.$route.query.url) {
      this.qrcodeImgUrl = this.$route.query.url;
      this.qrcodeCreate(this.$route.query.url);
      return;
    }
    this.qrcodeCraeteHandler();
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    async qrcodeCraeteHandler() {
      const referralCode = await getReferralCode();
      this.qrcodeImgUrl = referralCode.data;
      this.qrcodeCreate(this.qrcodeImgUrl);
    },
    qrcodeCreate(url) {
      const myCanvas = document.getElementsByClassName("qrcode")[0];
      QrCodeWithLogo.toCanvas({
        canvas: myCanvas,
        content: url,
        logo: {
          src: LocalImage,
          radius: 8
        }
      });
    },
    onCopy: function(e) {
      this.$toast("复制成功");
    }
  }
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
main {
  height: 100vh;
  position: relative;
  background: url("~@/common/images/BG2.png") no-repeat center;
  background-size: cover;
}
img {
  display: block;
  margin: 0 auto;
  height: 100%;
}

header img {
  width: 0.5rem;
  height: 0.5rem;
}
header {
  z-index: 99;
  position: absolute;
  right: 0.5rem;
  top: 0.4rem;
  display: flex;
}
.wrap {
  position: relative;
  width: 100%;
  top: 0;
  left: 0;
  margin: 0 auto;
  height: 6rem;
  .qr_background {
    width: 5rem;
  }
  .qrcode {
    position: absolute;
    bottom: 0.1rem;
    left: 50%;
    transform: translateX(-50%);
    height: 2.9rem !important;
    width: 2.9rem !important;
  }
}
.linkbar {
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  padding-top: 1rem;
}
.link {
  border: 1px solid #7e8191;
  border-radius: 1rem;
  overflow: hidden;
  overflow-x: scroll;
  padding: 0.1rem 0.25rem;
  box-sizing: border-box;
}
.link p {
  color: #7e8191;
  font-size: 0.24rem;
  margin-right: 0.3rem;
  background-color: #15151e;
  white-space: nowrap;
}
.copylink {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  width: 30%;
  background: linear-gradient(47deg, #16cbfd 19%, #008ae3 63%);
  margin-left: 0.3rem;
}
.copylink a {
  color: #caebfd;
  font-size: 0.24rem;
  padding: 0.1rem;
  white-space: nowrap;
}
</style>

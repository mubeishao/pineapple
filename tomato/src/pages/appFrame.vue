<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      url: this.$route.query.url, //请求地址
      title: this.$route.query.title || "游戏厅", //标题
      gameId:this.$route.query.gameId,
      screenOrientation:
        this.$route.query.screenOrientation || "portrait-primary", //屏幕屏幕方向
      //"portrait-primary" : 竖屏正方向
      //"landscape-primary”: 横屏正方向
      unlockOrientation: this.$route.query.unlockOrientation || true //是否启用屏幕旋转
    };
  },
  created() {},
  mounted() {
    //alert(navigator.userAgent);
    //alert(this.url);
    if (isApp) {
      this.initAppFrame();
    } else {
      window.location.href = this.url;
    }
  },
  methods: {
    initAppFrame() {
      let vm=this;
      plus.screen.lockOrientation(this.screenOrientation); //设定屏幕默认方向
      if (this.unlockOrientation) {
        plus.screen.unlockOrientation(); // 启用旋转屏幕
      }
      var webview = plus.webview.create(this.url, "appFrame", {
        hardwareAccelerated: true,
        popGesture:'none',
        titleNView: {
         backgroundColor:"#333333",
          titleColor:'#FFFFFF',
          titleText: this.title,
          progress: { color: "#00FF00" },
          titleSize: 25,
          buttons: [
            {
              type: "home",
              float: "left",
              onclick: function(event) {
                plus.nativeUI.confirm("您确定结束游戏吗?", function(
                  e
                ) {
                  //alert("Close confirm: "+e.index);
                  if (e.index == 0) {
                    webview.close("zoom-fade-in", 350);
                    plus.webview.currentWebview().back();
                    plus.screen.lockOrientation("portrait-primary"); //屏幕方向强制改变成竖屏正方向
                  }
                });
              }
            },
            {
              text: "刷新",
              float: "right",
              fontSize: 14,
              width: 40,
              onclick: function(event) {
                webview.reload();
              }
            },
            {
              text: "转账",
              float: "right",
              fontSize: 14,
              width: 40,
              onclick: function(event) {
                var wvTransfer = plus.webview.create("ptaccount/transfer?gameId="+vm.gameId+"&parentName="+vm.title+"&isWebView=true", "transferFrame",);
                wvTransfer.show("zoom-fade-out", 350);
                plus.screen.lockOrientation(vm.screenOrientation); //设定屏幕默认方向
              }
            }
          ]
        }
      });

      webview.show("zoom-fade-out", 350);
    }
  }
};
</script>
<style scoped>
</style>
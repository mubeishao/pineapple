<template>
  <div class="layout">
    <transition :name="transitionName">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      transitionName: ""
    };
  },
  watch: {
    $route(to, from) {
      const toName = to.name;
      const toDep = to.path.split("/");
      const fromDep = from.path.split("/");
      // 基本資料 -> 個人中心
      if (toDep[1] === "myself" && fromDep[1] === "basicdocument") {
        this.transitionName = "R-Slide-vertical";
        return;
      }
      // 發展下線
      if (toDep[3] === "subordinate") {
        this.transitionName = "pop";
        return;
      }
      if (fromDep[3] === "subordinate") {
        this.transitionName = "R-pop";
        return;
      }
      // 個人中心
      if (
        (toDep[1] === "myself" || toDep[1] === "message") &&
        from.name != "Main"
      ) {
        const fromDepth = from.path.length;
        this.transitionName =
          to.path.length > from.path.length
            ? "Slide-horizontal"
            : "R-Slide-horizontal";
        return;
      }

      // 過廠動畫測試 頁面名稱:動畫名稱
      const AnimeObj = {
        MySelf: "Slide-horizontal",
        message: "Slide-vertical",
        activityCenter: "Slide-vertical",
        AgentCenter: "Slide-horizontal",
        Mail: "Slide-horizontal",
        ReCharge: "Slide-horizontal",
        shareMakingMoney: "pop",
        basicDocument: "Slide-vertical"
      };
      if (to.name === "Main") {
        this.transitionName = "R-" + AnimeObj[from.name];
        return;
      }
      this.transitionName = AnimeObj[toName];
    }
  }
};
</script>
<style lang="scss" scoped>
// 水平滑入滑出
.Slide-horizontal-enter-active {
  position: fixed;
  width: 100%;
  height: 100vh;
  transition: 0.4s;
  z-index: 9999;
  top: 0;
  left: 0%;
  background: #1f212e;
}
.Slide-horizontal-enter {
  left: 100%;
  bottom: 0;
}
.Slide-horizontal-leave-active {
  transition: 0.3s;
}

.R-Slide-horizontal-leave-active {
  transition: left 0.4s;
  left: 0%;
  background: #1f212e;
  width: 100%;
  z-index: 999999;
}
.R-Slide-horizontal-leave-to {
  position: fixed;
  z-index: 9999;
  left: 100%;
  height: 100%;
}
.R-Slide-horizontal-enter-active {
  opacity: 0;
  transition: opacity 0.01s;
}

// 垂直滑入滑出
.Slide-vertical-enter-active {
  position: fixed;
  width: 100%;
  transition: 0.4s;
  z-index: 9999;
  top: 0%;
}
.Slide-vertical-enter {
  top: -100%;
}
.Slide-vertical-leave-active {
  transition: 0.3s;
}
.R-Slide-vertical-leave-active {
  transition: 0.3s;
  top: 0%;
}
.R-Slide-vertical-leave-to {
  position: fixed;
  z-index: 9999;
  top: -100%;
  width: 100%;
}

// 彈出
.pop-enter-active {
  transition: 0.3s;
  transform: scale(1);
}

.pop-enter {
  transform: scale(0);
}

.R-pop-leave-active {
  transition: 0.3s;
  transform: scale(0);
}
.R-pop-leave {
  transform: scale(1);
}
.layout {
  height: 100%;
  box-sizing: border-box;
}
</style>

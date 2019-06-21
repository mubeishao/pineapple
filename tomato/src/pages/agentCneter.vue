<template>
  <div class="agentCenter">
    <headertop title="代理中心"/>
    <ul class="querybj">
      <li>
        <router-link :to="{name:'PerforanceQuery'}">
          <div class="query">
            <p>业绩查询</p>
            <p>
              <img src="../common/images/rightIcon.png">
            </p>
          </div>
        </router-link>
      </li>
      <li>
        <router-link :to="{name:'LayerManagment'}">
          <div class="query">
            <p>排线码</p>
            <p>
              <img src="../common/images/rightIcon.png">
            </p>
          </div>
        </router-link>
      </li>

      <li>
        <router-link :to="{name:'AgentMangement'}">
          <div class="query">
            <p>代理管理</p>
            <p>
              <img src="../common/images/rightIcon.png">
            </p>
          </div>
        </router-link>
      </li>

      <li>
        <router-link :to="{name:'Sumbordquery'}">
          <div class="query">
            <p>下级查询</p>
            <p>
              <img src="../common/images/rightIcon.png">
            </p>
          </div>
        </router-link>
      </li>
      <li>
        <router-link :to="{name:'Subordinate'}">
          <div class="query">
            <p>发展下线</p>
            <p>
              <img src="../common/images/rightIcon.png">
            </p>
          </div>
        </router-link>
      </li>
      <li>
        <router-link :to="{name:'faq'}">
          <div class="query">
            <p>FAQ</p>
            <p>
              <img src="../common/images/rightIcon.png">
            </p>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
import Headertop from "../components/Header";
export default {
  data() {
    return {};
  },
  components: {
    Headertop
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.querybj {
  width: 100%;
  height: auto;
  margin: 0 auto;
  padding-top: remCalc(21);
}
.querybj li {
  width: 100%;
  margin-top: 0.02rem;
  height: remCalc(120);
  line-height: remCalc(120);
  border-bottom: 0.02rem solid #252538;
  background: #1b1b28;
}
.query {
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  font-size: 0.3rem;
  color: #b1b2b6;
}
.query img {
  width: 0.22rem;
  height: 0.26rem;
}
</style>


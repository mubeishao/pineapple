<template>
  <div class="agent">
    <Headertop title="代理管理"/>
    <div class="friendID">
      <a href="javascript:;">
        <img src="../common/images/sousuid.png"   >
      </a>
      <input
        placeholder="好友ID"
        type="search"
        v-model="memId"
        value
        @keyup.enter="searchFile($event)"
        ref="input1"
        v-on:input="inputFunc"
      >
    </div>
    <div class="increase">
      <div class="managent">
        <p class="gentnum">{{sonCount}}</p>
        <p>直属代理</p>
      </div>
      <div class="today">
        <p class="gentnum">{{todayRegisterCount}}</p>
        <p>今日新增</p>
      </div>
    </div>
    <div class="container">
      <ul class="performance">
        <li>排名</li>
        <li>昵称</li>
        <li>ID</li>
        <li class="four">本周业绩</li>
        <li class="five">团队人数</li>
      </ul>
      <ul class="perform" v-show="showArray" v-for="(agent,index) in agentArray" :key="index">
        <li>{{agent.no}}</li>
        <li class="ellipsis" @click.prevent="jumpToSumbordquery(agent.memId)">{{agent.nickName}}</li>
        <li>{{agent.memId}}</li>
        <li class="four">{{agent.bet}}</li>
        <li class="five">{{agent.teamerCount}}</li>
      </ul>
      <!-- <ul class="perform" v-show="!showArray"  v-for="(agentObj,indexs) in agentObjArray" :key="indexs">
        <li>{{agentObj.no}}</li>
        <li class="ellipsis">{{agentObj.nickName}}</li>
        <li>{{agentObj.memId}}</li>
        <li class="four">{{agentObj.bet}}</li>
        <li class="five">{{agentObj.teamerCount}}</li>
      </ul> -->
    </div>

    <!-- <div class="pation" v-show="showArray"> -->
    <Patitation
      @jumpPage="jumpPage"
      :pageNumber="pageNumber"
      :PageSize="PageSize"
      :totalCount="totalCount"
    />
    <!-- </div> -->
  </div>
</template>
<script>
import Patitation from "../components/Patitation";
import axios from "axios";
import Headertop from "../components/Header";
import { getManageChilds, getqueryChild } from "../api/interface";
import Storage from "../common/utils/storage";
export default {
  data() {
    return {
      pageIndex: 1, //页码
      pageSize: 10, //每页显示的条数
      pageNumber: 1,
      PageSize: 10,
      totalCount: 0,
      sonCount: 0, //直属代理
      todayRegisterCount: 0, // 今日新增
      agentArry: [],
      total: 0,
      addArray: [],
      memId: "",
      agentArray: [],
      teamBet: "",
      showArray: true
    };
  },
  mounted() {
    this.accountChange();
    
  },
  methods: {
    async jumpPage(e) {
      const { pageSize } = this;
      let params = {
        pageIndex: e.currentPage,
        pageSize
      };
      let res = await getManageChilds(params);
      console.log(res)
      if(res.result==1){
         this.agentArray = res.data.childs
      }else{
         this.$toast(res.message)
      }
    },

    async accountChange() {
      const { pageIndex, pageSize } = this;
      let vm = this;
      let params = {
        pageIndex,
        pageSize
      };
      let res = await getManageChilds(params);
      if (res.result === 1) {
        
        this.agentArray = res.data.childs
        this.totalCount = res.data.childsTotalCount;
        this.sonCount =res.data.sonCount  
        this.todayRegisterCount = res.data.todayRegisterCount;
      }else if(res.result==0){
          this.$toast(res.message)
          this.showArray =false
          
        }
    },

    async searchFile(event) {
      var e = event || window.event;
      if(this.memId==''){
         return
      }
      const { pageIndex, pageSize,memId } = this;
      let params = { memId,pageIndex, pageSize};
     
      let res = await getManageChilds(params);
        if (res.result === 1) {
          this.agentArray = res.data.childs;
           this.totalCount = res.data.childsTotalCount;
        }else if(res.result==0){
          this.$toast(res.message)
          this.showArray =false
          
        }
      
    },
    inputFunc() {
      if (this.$refs.input1.value == "") {
        this.showArray = true;
        this.accountChange();
      }
    },
    jumpToSumbordquery(name) {
      this.$router.push({ name: "Sumbordquery", query: { name } });
    }
  },
  components: {
    Headertop,
    Patitation
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.agent {
  width: 100%;
  overflow-x: hidden;
  height: 100vh;
}
.friendID {
  display: flex;
  align-items: center;
  font-size: remCalc(40);
  line-height: remCalc(40);
  height: remCalc(63);
  padding: 0 0 0 0.3rem;
  background: #282a39;
  margin: remCalc(21) auto;
  a {
    width: 0.4rem;
    img {
      padding-top: 3px;
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
}

input::-webkit-input-placeholder {
  color: #5a5a5c;
  font-size: 0.2rem;
}
.increase {
  display: flex;
  width: 100%;
  height: 0.7rem;
  background: #171723;
  font-size: 0.24rem;
  color: #dedede;
  text-align: center;
  margin-top: 0.2rem;
  border: 1px solid #3b405e;
}

.managent,
.today {
  flex: 1;
  padding-top: 0.1rem;
}
.today {
  border-left: 1px solid #3b405e;
}
.gentnum {
  color: #e0a019;
}
.container {
  width: 100%;
  font-size: 0.24rem;
  color: #989898;
  text-align: center;
  height: 75%;
}
.performance {
  display: flex;
  width: 100%;
  background: #333748;
  height: 0.6rem;
  line-height: 0.6rem;
  margin: 0 auto;
}
.performance li {
  flex: 1;
}
.ellipsis {
  text-overflow: ellipsis;
}
.four {
  padding-right: 0.2rem;
}
.five {
  padding-right: 0.3rem;
}
.perform {
  display: flex;
  width: 100%;
  margin: 0.1rem auto;
  height: 0.6rem;
}
.perform li {
  flex: 1;
}

// .pation {
//   width: 100%;
//   height: 1rem;
//   // line-height: 1rem;

//   background: #171723;
// }
</style>


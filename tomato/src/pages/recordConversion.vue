<template>
  <div class="record">
    <header-top title="兑换记录"/>
    <div class="data">
      <p >兑换时间</p>
      <p>兑换金额</p>
      <p class="transInfo">兑换信息</p>
      <p>状态</p>
    </div>
    <ul
      v-show="conversionArr.length"
      class="account"
      v-for="(count,index) in conversionArr"
      :key="index"
    >
      <li>
        <span class="spdate">{{count.createTime|dateformat('MM-DD HH:mm')}}</span>
      </li>
      <li>{{count.amount}}</li>
      <li class="transdata">
          <p >{{count.accountName}}</p>
          <p >{{count.accountNo|accountFormat}}</p>
        
      </li>
      <li>{{count.status}}</li>
    </ul>
    <div v-show="conversionArr.length<=0" class="norecord">
      <img src="../common/images/norecord.png">
    </div>

    <div class="pation" v-show="conversionArr.length">
      <Patitation
        @jumpPage="jumpPage"
        :pageNumber="pageNumber"
        :PageSize="PageSize"
        :totalCount="totalCount"
      />
    </div>
  </div>
</template>
<script>
import HeaderTop from "../components/Header";
import Patitation from "../components/Patitation";
import { getConversionRecord } from "../api/interface";
import Storage from "../common/utils/storage";
export default {
  data() {
    return {
      conversionArr: [],
      PageSize: 10,
      pageNumber: 1,
      totalCount: 0,
      accountObj:{},
      accountNum:'',
      pageIndex: 1, //页码
      pageSize: 10 //每页显示的条数
    };
  },



  mounted() {
    let vm = this;
    vm.getRecord();
    
 
  },
  methods: {
   

    async jumpPage(e) {
      let vm = this;
      const { pageSize } = this;
      let params = {
        pageIndex: e.currentPage,
        pageSize
      };
      let res = await getConversionRecord(params);
      vm.conversionArr = res.data.data;

    
    },
    async getRecord() {
      let vm = this;
      const { pageIndex, pageSize } = this;
      let params = {
          pageIndex,
          pageSize
      };
      let res = await getConversionRecord(params);
      if (res.result === 1) {
        vm.conversionArr = res.data.data;  
        vm.totalCount = res.data.totalCount;
        
        
      }else if(res.result==0){
         this.$toast(res.message)
      }
    }
  },

  components: {
    HeaderTop,
    Patitation
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.data {
  display: flex;
  text-align: center;
  width: 100%;
  height: 0.8rem;
  line-height: 0.8rem;
  margin: remCalc(21) auto 0.1rem auto;
  background: #222126;
}
.data p {
  flex: 1;
  font-size: 0.28rem;
}
.data .transInfo{
  flex:2
}
.spdate {
  display: block;
  max-width: 1rem;
  height: 1rem;
  line-height: 0.34rem;
  padding-top: 0.1rem;
  padding-left: 0.12rem;
}
.account {
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  text-align: center;
}
.account li {
  flex: 1;
  height: 0.9rem;
  line-height: 0.9rem;
  font-size: 0.26rem;
  background: #1d1d1d;
  border-bottom: 0.01rem solid #2c2c7f;
}
.transdata{
   flex: 2 !important;
   height: 0.9rem;
   line-height: 0.4rem !important;
   padding-left: 0.1rem;
}
.transName{
   height: 0.2rem;
}
.pation {
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  position: fixed;
  left: 0;
  bottom: 0;
  background: #171723;
}
.norecord {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.norecord img {
  display: block;
  margin-top: 2rem;
  width: 3rem;
  height: 2.4rem;
}
</style>


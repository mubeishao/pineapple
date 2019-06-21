<template>
    <div class="gameInfo">
         <headertop title="信息" />
         <div class="content">
              <div class="myinfo">
                  <p class="updateAd">更新公告</p>
                  <p class="myEmail">我的邮件</p>
              </div>
              <div class="system">
                   <div class="send">
                       <p class="email">发件人：系统</p>
                        <p class="time">{{(new Date()).getTime()|dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
                   </div>
                   <div class="theme">
                       <div class="hall">主题：大厅维护完毕</div>
                       <div class="solve">
                           <img src="../common/images/querylook.png"/>
                           <img src="../common/images/delete.png" />
                       </div>
                   </div>
              </div>
               <div class="system">
                   <div class="send">
                       <p class="email">发件人：系统</p>
                       <p class="time">{{(new Date()).getTime()|dateformat('YYYY-MM-DD HH:mm:ss')}}</p>
                   </div>
                   <div class="theme">
                       <div class="hall">主题：大厅维护完毕</div>
                       <div class="solve">
                           <img src="../common/images/querylook.png"/>
                           <img src="../common/images/delete.png" />
                       </div>
                   </div>
              </div>
         </div>
       
    </div>
</template>
<script>

import Headertop from '../components/Header' 
export default {
    data(){
        return{
            
        }
    },
    methods:{
        
    },
    components:{
        Headertop
    },
    //  filters:{
    //         dateForm:function(el){
    //             return moment(el).format("YYYY-MM-DD HH:mm:ss")
    //         }
    // }
   
}

</script>
<style scoped>
    .content{
        width: 100%;
        margin: 1.2rem auto;    
        overflow-x: hidden;
    }
    .myinfo{
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        width: 99%;
        height: 0.6rem;
        line-height: 0.6rem;
        margin: 0 auto;
    }
    .myinfo p{
         flex: 1;
         font-size: 0.24rem;
         border: 0.01rem solid #3b4378;
    }
    .updateAd{
        color: #4e5164;
        border-left: none;
        background: url('../common/images/adsBJ.png') no-repeat;
        background-size:100% 100%; 
    }
    .myEmail{
        color: #dedede;
        background: url('../common/images/myemails.png') no-repeat;
        background-size:100% 100%; 
    }
    .system{
        width: 94%;
        height: auto;
        margin: 0.3rem auto;
        background: url('../common/images/themeBJ.png') no-repeat;
        background-size: 100% 100%;
        font-size: 0.24rem;
    }
    .send{
        width: 100%;
        display: flex;
        height: 0.45rem;
        line-height: 0.45rem;
    }
    .email{
        width: 100%;
        height: 100%;
        background: url('../common/images/sendbj.png') no-repeat;
        background-size: 100% 100%;   
        padding-left: 0.2rem;
        color: #161615;
        font-weight: bold;
    }
    .theme{
        display: flex;
        width: 100%;
        height:0.7rem;
        line-height: 0.7rem;
    }
    .solve img{
        padding-top: 0.1rem;
        width: 0.9rem;
        height: 0.45rem;
    }
    .hall{
        padding-left: 0.2rem;
        color: #d8d8d8;
    }
    .solve{
        padding-right: 0.1rem;
    }
    .time{
        color: #4e5164;
        font-size: 0.2rem;
    }
    .email,.hall{
        flex: 2;
    }
    .time,.solve{
        flex: 1.2
    }
   


</style>


<template>
     <div class="notFound">
          <Headertop/>
          <div class="not"></div> 
     </div>
</template>
<script>
import Headertop from './Header' 
export default {
     data(){
         return{

         }
     },
     components:{
         Headertop
     }
  
}
</script>
<style scoped>
     .notFound{
         width:100%;
         height:100%;
         display: flex;
         justify-content: center;
         align-items: center;
         background: url('../common/images/404.jpg') no-repeat;
         background-size: 100%  100%;
     }
    
</style>

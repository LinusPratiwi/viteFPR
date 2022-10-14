<template>
    <div class="flex justify-end mr-5">
        <!-- <p>you {{bbox}}</p> -->
        <!-- <img id="img_pict" :src="extId" > -->
        <canvas id="canv_pict"  ></canvas>
    </div>
</template>

<script setup>
import { ref, watchEffect, onMounted, getCurrentInstance } from 'vue'
const canvas = ref < HTMLCanvasElement | null > (null);

const props = defineProps({
    extId: String,
    bbox: Array
})

const _bbox = ref(props.bbox) 
const img = document.getElementById('img_pict')



onMounted(() => {
    let context = document.getElementById('canv_pict').getContext('2d')
    console.log("pppp==> ", _bbox.value)
    // img.classList.add("rounded-lg")
    watchEffect(async () => {
          _bbox.value = props.bbox
        let data = _bbox.value

        if (data !== null) {
            // instance?.proxy?.$forceUpdate();
           
            console.log("watch => ", data)
            // context.drawImage(a, data[0] , data[1] , data[2], data[3] )
            context.clearRect(0,0,300,150)
            context.beginPath()
            context.rect(`${data[0]}`, `${data[1]}`, `${data[2]}`, `${data[3]}`)
            context.lineWidth = 3;
            context.strokeStyle = 'green';
            context.stroke();
        } 
    }
      )
})



const init =async()=>{
    console.log("aa=>",_bbox.value)
    //
}

init()


</script>

<style scoped>
#img_pict{
    position:absolute;
    z-index: 1;
    /* height : 160px;
    width:213px */
}
#canv_pict {
    position: absolute;
    z-index: 3;
    /* height: 160px;
    width: 213px */
}
</style>
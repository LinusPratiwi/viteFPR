<template>
    <div class="row-span-2 col-span-3 ">
        <div class="block p-6 bg-white rounded-lg border border-gray-200 shadow-md ">
            <!-- camera -->
            <div class="camera-box">
                <!-- toggle -->
                
                <Switch  v-model="enabled" @click="cameraStatus" :class="enabled ? 'bg-teal-700' : 'bg-gray-200'"
                    class="relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                    <span class="sr-only">Use setting</span>
                    <span aria-hidden="true" :class="enabled ? 'translate-x-9' : 'translate-x-0'"
                        class="pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                </Switch>
                <!-- end toggle -->
                
                <!-- camera -->
                <div  >
                    <video :srcObject="camera" ref="camera"  autoplay ></video>
                    
                    <canvas ref="canvas"></canvas>
                    <canvas id="canvas#"></canvas>
                </div>
                <!-- <div v-else-if="!enabled">
                    <h1></h1>
                </div> -->
            </div>
            
        </div>
        
    </div>
    
</template>

<script setup>
import { ref,onMounted,onBeforeMount,onBeforeUnmount,watch  } from 'vue'
import { Switch } from '@headlessui/vue'
import * as tf from '@tensorflow/tfjs'
import { Buffer } from "buffer/";

const enabled = ref(false) 
const camera = ref(null )   
const canvas = ref<HTMLCanvasElement | null>(null); 
const picture = ref('')


const constraints = (window.constraints = {
    audio: false,
    video: true, 
})

const startCamera =async () => {
    try {
        camera.value = await navigator.mediaDevices.getUserMedia(constraints)
    } catch (error) {
        alert(error, "May the browser didn't support or there is some errors.")
    }
}

const stopCamera = async () => {
    let tracks =  document.querySelector('video').srcObject.getTracks()
    const vid = document.querySelector('video')
    const context = document.querySelector('canvas').getContext('2d')
    const context2 = context
    context.drawImage(vid, 40, 40, 115, 110)
    
    console.log("sf",enabled)
    const pict = document.querySelector('canvas').toDataURL('image/jpg')
    console.log(pict)
    // const buf = new Buffer(pict.replace(/^data:image\/\w+;base64,/, ""),'base64')
    
    let req = {
            base64: pict,
    }

    const a =await fetch("https://pxtah2gv1i.execute-api.ap-southeast-1.amazonaws.com/add",{
        method: "post",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify(req)
    })

    const data =await a.json()
    console.log(data)
    const [x, y, width, height] = [data[1].Left, data[1].Top, data[1].Width, data[1].Height]; 
    context2.beginPath()
    context2.rect(`${x * 300}`, `${y * 150}`, `${width * 300}`, `${height * 150}`)
    context2.lineWidth = 3;
    context2.strokeStyle = 'green';
    context2.stroke();
    // setTimeout(stopCamera, 100);
    console.log("boundingbox : ",x,y,width,height)
    
   tracks.forEach(element => {
        // element.stop()
   });
 
   

}

const cameraStatus = ()=>{
    if(enabled.value === true){
        enabled.value === false
        stopCamera()
        console.log("stop", enabled.value)
    }
    if(enabled.value === false){
        enabled.value === true
        startCamera()
        
        console.log('start',enabled.value)
    }
}

watch(picture, (newVal)=>{
    localStorage.setItem('picture',newVal)
})

onMounted(() => {
	picture.value = localStorage.getItem('picture') || ''
	
})

const runSSD =  () => {
    // 3. TODO - Load network 
    const net =  tf.loadGraphModel('E:\KULIAH\PA\FE_LP\FEv\viteFP\model.json')
    console.log(net)
    // Loop and detect hands
    // setInterval(() => {
    //   detect(net);
    // }, 16.7);
  };

const takePhoto = ()=>{
    const canvas = document.querySelector('canvas')
    const context = canvas.getContext('2d')
    const photoFromVideo = document.querySelector('video')
    context.drawImage(photoFromVideo, 0, 0, 45, 37)
} 



</script>

<style lang="scss" scoped>
#canv{
    background-color: red($color: #000000);
    display: block;
}
</style>
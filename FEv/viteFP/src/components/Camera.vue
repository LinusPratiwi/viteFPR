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
                    <!-- click -->
                    </Switch>
                <!-- end toggle -->
                
                <!-- camera -->
                <div  >
                    <video :srcObject="camera" ref="camera"  autoplay ></video>
                    <!-- <canvas ref="canvas" style=" position:absolute; height:480px;width:640px"></canvas> -->
                   
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
// import { Buffer } from "buffer/";


const enabled = ref(false) 
const camera = ref(null )   
const canvas = ref<HTMLCanvasElement | null>(null); 
const picture = ref('')
let context2
let _plate_bbox
const emit = defineEmits(["setExtId"])


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
    context2 = context
    context.drawImage(vid, 0, 0, 100, 115)
    
    // console.log("sf",enabled)
    const pict = document.querySelector('canvas').toDataURL('image/jpg')
    // console.log(pict)
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
    await runSSD()
    // console.log("runssd-->",res)
    const data =await a.json()
    // console.log(data[2])
    const [x, y, width, height] = [data[1].Left, data[1].Top, data[1].Width, data[1].Height]; 
    const bbox = [`${x * 300}`, `${y * 150}`, `${width * 300}`, `${height * 150}`]
    console.log("plate det : ",data[2])
    
    const canv_app = document.getElementById('canv_app').getContext('2d')
    canv_app.drawImage(vid, 0, 0, 100, 115)

    emit('setExtId',[pict,bbox])
    // emit('setBbox',bbox)
    // setTimeout(stopCamera, 100);
    // console.log("bbox plate: ",_plate_bbox)
    // console.log("return bbox : ", res)
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

const runSSD =  async() => {
    // 3. TODO - Load network 
    context2 = document.getElementById('plate_canv').getContext('2d')
    const net =await tf.loadGraphModel('../../ssd_model/model.json')
    console.log("SSD ** ",net)

    const vid = document.querySelector('video')
    const img = tf.browser.fromPixels(vid)
    const resized = tf.image.resizeBilinear(img,[640,480])
    const casted = resized.cast('int32')
    const expanded  = casted.expandDims(0)
    const obj = await net.executeAsync(expanded)

    const boxes = await obj[0].array()
    const scores = await obj[3].array()
    console.log("scores : ",scores)
    requestAnimationFrame(() => { drawRect(boxes[0],  scores[0], 0.5, 300, 150, context2) }
    )
    const _box = boxes[0]
    // let _maxconf = 0

    tf.dispose(img)
    tf.dispose(resized)
    tf.dispose(casted)
    tf.dispose(expanded)
    tf.dispose(obj)
    // return _plate_bbox
}

const drawRect = (boxes, scores, threshold, imgWidth, imgHeight, ctx) => {

    for (let i = 0; i <= boxes.length; i++) {
        if (boxes[i] && scores[i] > threshold) {
            // Extract variables
            const [y, x, height, width] = boxes[i]
         

            // Set styling
            ctx.strokeStyle = 'red'
            ctx.lineWidth = 3

            // DRAW!!
            ctx.clearRect(0, 0, 300, 150)
            ctx.beginPath()
            ctx.rect(x * imgWidth, y * imgHeight, width * imgWidth / 2, height * imgHeight / 2);
            ctx.stroke()
            // ctx.beginPath()
            // ctx.rect(0,0,40,40)
            // ctx.strokeStyle='green'
        }
    }
}


</script>

<style lang="scss" scoped>
#canv{
    background-color: red($color: #000000);
    display: block;
}
</style>
<template>
    <div class="row-span-2 col-span-3 ">
        <div class="block p-6 bg-white rounded-lg border border-gray-200 shadow-md ">
            <div class="md:flex md:justify-between md:items-center">
                <Switch v-model="enabled" @click="cameraStatus" :class="enabled ? 'bg-teal-700' : 'bg-gray-200'"
                    class="relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            
                    <span class="sr-only">Use setting</span>
                    <span aria-hidden="true" :class="enabled ? 'translate-x-9' : 'translate-x-0'"
                        class="pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out" />
                    <!-- click -->
                </Switch>
            
                <!-- end toggle -->
                <button class="hover:bg-green-700 text-red-600 underline font-bold py-2 px-4 rounded hover:text-white">
                    Start Recognition
                </button>
            </div>
            
            <!-- camera -->
            <div class="camera-box md:px-4 md:py-4" >
                <!-- toggle -->
                
                
                <!-- camera -->
                <div  >
                    <video :srcObject="camera" ref="camera" class="w-full rounded-lg border border-gray-200 shadow-md" autoplay ></video>
                    <!-- <canvas ref="canvas" style=" position:absolute; height:480px;width:640px"></canvas> -->
                   
                </div>

            </div>
            
        </div>
        
    </div>
    
</template>

<script setup>
import { ref,onMounted,watch  } from 'vue'
import { Switch, SwitchLabel,SwitchGroup } from '@headlessui/vue'
import * as tf from '@tensorflow/tfjs'

const enabled = ref(false) 
const camera = ref(null )   
// const canvas = ref<HTMLCanvasElement | null>(null); 
const picture = ref('')
let context2
let bbox
let pict

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
    
    // context.drawImage(vid, 0, 0, 213, 160)
    context.drawImage(vid, 0, 0, 213, 160)

    pict = document.querySelector('canvas').toDataURL('image/jpg')
    console.log(pict)

    let param = {
            base64: pict,
    }

    const face =await fetch("https://pxtah2gv1i.execute-api.ap-southeast-1.amazonaws.com/add",{
        method: "post",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(param)
    })

    const plate = await fetch("https://k7loituhdl.execute-api.ap-southeast-1.amazonaws.com/test", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(param)
    })

    const face_res =await face.json()
    const plate_res = await plate.json()
    let date = Date.now()
    date = new Date(date)

    const db_param = {
            face_extId: face_res[2],
            plate_extId : plate_res[1],
            plate : plate_res[2],
            _timestamp :date
    }

    const addtoDB = await fetch("https://drqwjtpeyl.execute-api.ap-southeast-1.amazonaws.com/addtoDB", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(db_param)
    })


    const db_res = addtoDB.json()
    console.log("s",db_res)
   
    const searchPlate = await fetch("https://drqwjtpeyl.execute-api.ap-southeast-1.amazonaws.com/searchPlate", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(plate_res[1])
    })

    console.log("PLATE ->", searchPlate)
    const [x, y, width, height] = [face_res[1].Left, face_res[1].Top, face_res[1].Width, face_res[1].Height]; 
     bbox = [`${x * 300}`, `${y * 150}`, `${width * 300}`, `${height * 150}`]
    console.log("plate det : ", plate_res)
    
    // const canv_app = document.getElementById('canv_app').getContext('2d')
   
    // canv_app.drawImage(vid,0,0,213,160)
     console.log("%%%%", (y * 480) + 10, (x * 640) + (width * 640) + 230, (y * 480) + (height * 480) + 10, (x * 640) +70)
    document.getElementById('canv_app').style.position="absolute"
      

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



onMounted(() => {
	// picture.value = localStorage.getItem('picture') || ''
    watch(enabled, (newVal) => {
        // localStorage.setItem('picture',newVal)
        emit('setExtId', [pict, bbox, enabled])


    })
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
// #canv_app{
//     clip:rect'(eval("a,b,c,d"))''
// }
</style>
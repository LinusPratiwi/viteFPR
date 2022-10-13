<template>
    <div class=" row-span-2 col-span-2">
        <div style="height:100%" class=" w-full bg-white rounded-lg border shadow-md dark:bg-gray-800 dark:border-gray-700 ">
            <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 bg-gray-50 rounded-t-lg border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800"
                id="defaultTab" data-tabs-toggle="#defaultTabContent" role="tablist">
                <li class="mr-2">
                    <button id="about-tab" data-tabs-target="#about" type="button" role="tab" aria-controls="about"
                        aria-selected="true"
                        class="inline-block p-4 text-blue-600 rounded-tl-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-blue-500 hover:text-blue-600 dark:hover:text-blue-500 border-blue-600 dark:border-blue-500">Results</button>
                </li>
            </ul>

            <div class="grid  grid-flow-col">
                <div id="defaultTabContent" class="">
                    <div class=" bg-white rounded-lg md:p-8 dark:bg-gray-800" id="about" role="tabpanel"
                        aria-labelledby="about-tab">
                        <h2 class="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Detected
                            Face
                        </h2>
                        <p class="mb-3 text-gray-500 dark:text-gray-400">matched face image here</p>
                        <!-- <Picture :img64="extId" :bbox="bbox"></Picture> -->
                        <Picture :extId="extId" :bbox="bbox"></Picture>
                        <!-- <img :src="extId"/> -->
                        <!-- <canvas ref="canvas" ></canvas> -->
                        <!-- <p >you have {{extId}} </p> -->
                        <!-- <img src="data:image/png;base64,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"/> -->
                        <a href="#"
                            class="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700">

                            <svg class="ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clip-rule="evenodd"></path>
                            </svg>
                            xxxx %
                            <!-- <script></script> -->
                        </a>
                    </div>
                </div>

                <div id="defaultTabContent">
                    <div class=" bg-white rounded-lg md:p-8 dark:bg-gray-800" id="about" role="tabpanel"
                        aria-labelledby="about-tab">
                        <h2 class="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Detected
                            Plate
                        </h2>
                        <p class="mb-3 text-gray-500 dark:text-gray-400">matched plate image here</p>
                        <!-- <img src="data:image/jpeg;base64,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"
                            alt=""> -->
                        <img :src="extId" alt="" srcset="" style="position:absolute">
                        <canvas id="plate_canv" style="position:absolute"></canvas>
                        <a href="#"
                            class="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700">

                            <svg class="ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clip-rule="evenodd"></path>
                            </svg>
                            xxxx %
                        </a>
                    </div>
                </div>
            </div>

        </div>
    </div>


</template>


<script setup>
import Picture from './Picture.vue';
import {onMounted,ref} from 'vue'

// const canvas = ref < HTMLCanvasElement | null > (null);
const props = defineProps({
    extId:String,
    bbox :Array
})

// let a = ref(null)
// a = props.extId
// console.log("***",a)
// const context = document.querySelector('canvas').getContext('2d')
// context.drawImage(extId, 40, 40, 115, 110)
let picture

onMounted(()=>{
    picture = localStorage.getItem('picture') || ''
})
</script>




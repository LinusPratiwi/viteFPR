<template>
    <Header />
    <div class="grid grid-rows-2 grid-cols-5 gap-4 p-4">
        <Camera @setExtId="(data)=>{
          extId=data[0]
          bbox = data[1]
        }"></Camera>

        <Card :extId="extId" :bbox="bbox" />

    </div>
    <canvas ref="canvas" id="canv_app" style=" height:480px"></canvas>
</template>


<script setup >
import Header from '../components/Header.vue'
import Card from '../components/Cards.vue'
import Camera from '../components/Camera.vue'
import { ref } from 'vue'

const extId = ref(null)
const bbox = ref(null)



</script>

<style scoped>

</style>
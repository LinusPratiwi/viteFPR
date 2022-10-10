<template>
  <Header />
  <div class="grid grid-rows-2 grid-cols-5 gap-4 p-4">
    <Camera></Camera>
    <Card />
  </div>
</template>


<script setup >
import Header from './components/Header.vue'
import Card from './components/Cards.vue'
import Camera from './components/Camera.vue';


// const response = await fetch('https://pxtah2gv1i.execute-api.ap-southeast-1.amazonaws.com/test')
// console.log(response.json())

</script>

<style scoped>

</style>
<template>
 <div class="nav">
  <router-link :to="{name : 'Entry' }" ></router-link>
  <router-view />
  <!-- <router-link :to="{na  me : 'Exit' }"> Exit Gate</router-link> -->
 </div>

</template>


<script setup >
import Header from './components/Header.vue'
import Card from './components/Cards.vue'
import Camera from './components/Camera.vue'
import { ref } from 'vue'

const extId = ref(null)
const bbox = ref(null)



</script>

<style scoped>

</style>
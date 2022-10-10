<template>
    <div>
        <img src={{imageSrc}} alt="image" >
    </div>
</template>

<script setup>
const props = defineProps({
    imageSrc : String
})
</script>

<style lang="scss" scoped>

</style>
<template>
    <div class="min-h-screen dark:bg-slate-950">
        <NavBar />
        <router-view />
    </div>
</template>
<script>
import NavBar from '@/components/NavBar.vue';
</script>
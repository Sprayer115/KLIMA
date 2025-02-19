<!-- components/ModeToggle.vue -->
<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="icon" class="bg-background dark:bg-stone-950">
        <Icon icon="radix-icons:sun" 
              class="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Icon icon="radix-icons:moon"
              class="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 dark:text-white" />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="dark:bg-stone-900">
      <DropdownMenuItem @click="mode = 'light'">Light</DropdownMenuItem>
      <DropdownMenuItem @click="mode = 'dark'">Dark</DropdownMenuItem>
      <DropdownMenuItem @click="mode = 'system'">System</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
 </template>
  
  <script setup>
  import { useColorMode } from '@vueuse/core'
  import { Icon } from '@iconify/vue'
  import { Button } from '@/components/ui/button'
  import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger 
  } from '@/components/ui/dropdown-menu'
  
  const mode = useColorMode()
  </script>
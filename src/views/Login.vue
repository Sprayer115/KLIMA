<template>
  <div class="container mx-auto mt-20 max-w-md dark:text-white">
    <Card class="dark:bg-slate-900 dark:border-slate-800">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input id="email" v-model="email" type="email" />
          </div>
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input id="password" v-model="password" type="password" />
          </div>
          <Button type="submit" class="w-full">Login</Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
 
 <script setup>
 import { ref } from 'vue'
 //import { useAuthStore } from '@/stores/auth'
 import { useAuthStore } from '../stores/auth'
 import { useRouter } from 'vue-router'
 import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toast'
 const auth = useAuthStore()
 const router = useRouter()
 const email = ref('')
 const password = ref('')
 
 const handleLogin = async () => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Login fehlgeschlagen')
    }

    const { user, token } = await response.json()
    console.log(user, token)
    auth.setAuth({ user, token })
    router.push('/')
  } catch (error) {
    toast({ title: 'Fehler', description: error.message, variant: 'destructive' })
    console.error(error)
  }
}
 </script>
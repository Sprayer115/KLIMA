<template>
  <div class="container mx-auto mt-20 max-w-md dark:text-white">
    <Card class="dark:bg-slate-900 dark:border-slate-800">
      <CardHeader>
        <CardTitle>Registrieren</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input id="email" v-model="email" type="email" />
          </div>
          <div class="space-y-2">
            <Label for="password">Passwort</Label>
            <Input id="password" v-model="password" type="password" />
          </div>
          <div class="space-y-2">
            <Label for="confirmPassword">Passwort bestätigen</Label>
            <Input id="confirmPassword" v-model="confirmPassword" type="password" />
          </div>
          <Button type="submit" class="w-full">Registrieren</Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
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
const confirmPassword = ref('')
const role = ref('user')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    toast({ title: 'Fehler', description: 'Passwörter stimmen nicht überein', variant: 'destructive' })
    return
  }

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      })
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Registrierung fehlgeschlagen')
    }
    const { user, token } = await response.json()
    auth.setAuth({ user, token })
    router.push('/')
  } catch (error) {
    toast({ title: 'Fehler', description: error.message, variant: 'destructive' })
    console.error(error)
  }
}
</script>
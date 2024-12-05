<template>
    <div class="container mx-auto mt-20 max-w-md dark:text-white">
      <Card class="dark:bg-slate-900 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Passwort ändern</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handlePasswordChange" class="space-y-4">
            <div class="space-y-2">
              <Label for="currentPassword">Aktuelles Passwort</Label>
              <Input id="currentPassword" v-model="currentPassword" type="password" />
            </div>
            <div class="space-y-2">
              <Label for="newPassword">Neues Passwort</Label>
              <Input id="newPassword" v-model="newPassword" type="password" />
            </div>
            <div class="space-y-2">
              <Label for="confirmNewPassword">Neues Passwort bestätigen</Label>
              <Input id="confirmNewPassword" v-model="confirmNewPassword" type="password" />
            </div>
            <Button type="submit" class="w-full">Passwort ändern</Button>
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
  const currentPassword = ref('')
  const newPassword = ref('')
  const confirmNewPassword = ref('')
  
  const handlePasswordChange = async () => {
    if (newPassword.value !== confirmNewPassword.value) {
      toast({ 
        title: 'Fehler', 
        description: 'Neue Passwörter stimmen nicht überein', 
        variant: 'destructive' 
      })
      return
    }
  
    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          current_password: currentPassword.value,
          new_password: newPassword.value,
        })
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Passwortänderung fehlgeschlagen')
      }
  
      toast({
        title: 'Erfolg',
        description: 'Passwort wurde erfolgreich geändert. Sie werden nun abgemeldet.',
      })
      
      // Logout after successful password change
      setTimeout(() => {
        auth.logout()
        router.push('/login')
      }, 2000)
    } catch (error) {
      toast({ 
        title: 'Fehler', 
        description: error.message, 
        variant: 'destructive' 
      })
      console.error(error)
    }
  }
  </script>
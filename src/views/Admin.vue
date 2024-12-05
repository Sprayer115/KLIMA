<script setup>
import { ref, onMounted } from 'vue'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const { toast } = useToast()
const users = ref([])
const newUser = ref({ email: '', password: '', role: 'user' })

async function fetchUsers() {
  try {
    const response = await fetch('/api/users', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    if (!response.ok) throw new Error('Failed to fetch users')
    users.value = await response.json()
  } catch (error) {
    toast({ title: 'Error', description: error.message, variant: 'destructive' })
  }
}

async function addUser() {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(newUser.value)
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to add user')
    }
    await fetchUsers()
    newUser.value = { email: '', password: '', role: 'user' }
    toast({ title: 'Success', description: 'User added successfully' })
  } catch (error) {
    toast({ title: 'Error', description: error.message, variant: 'destructive' })
  }
}

async function deleteUser(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to delete user')
    }
    await fetchUsers()
    toast({ title: 'Success', description: 'User deleted successfully' })
  } catch (error) {
    toast({ title: 'Error', description: error.message, variant: 'destructive' })
  }
}

async function deleteNonAdminUsers() {
  try {
    const response = await fetch('/api/users/bulk/non-admin', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Failed to delete non-admin users')
    }
    await fetchUsers()
    toast({ title: 'Success', description: 'All non-admin users deleted' })
  } catch (error) {
    toast({ title: 'Error', description: error.message, variant: 'destructive' })
  }
}




onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="container mx-auto p-4 space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">User Management</h2>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete All Non-Admin Users</Button>
        </AlertDialogTrigger>
        <AlertDialogContent class="dark:bg-slate-900 dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle class="dark:text-white">Sind Sie sicher?</AlertDialogTitle>
            <AlertDialogDescription class="dark:text-slate-300">
              This action cannot be undone. This will permanently delete all non-admin users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel class="dark:bg-slate-800 dark:hover:bg-slate-700">Cancel</AlertDialogCancel>
            <AlertDialogAction @click="deleteNonAdminUsers">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    
    <div class="grid grid-cols-4 gap-4">
      <Input v-model="newUser.email" type="email" placeholder="Email" />
      <Input v-model="newUser.password" type="password" placeholder="Password" />
      <Select v-model="newUser.role">
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
      <Button @click="addUser">Add User</Button>
    </div>

    <Table>
      <TableCaption>List of all users</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="user in users" :key="user.id">
          <TableCell>{{ user.email }}</TableCell>
          <TableCell>{{ user.role }}</TableCell>
          <TableCell class="text-right">
            <Button @click="deleteUser(user.id)" variant="destructive" size="sm">Delete</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
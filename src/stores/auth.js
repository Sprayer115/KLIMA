import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => {
    let user = null;
    let token = localStorage.getItem('token') || null;

    try {
      user = JSON.parse(localStorage.getItem('user')) || null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }

    return {
      user,
      token
    };
  },
  actions: {
    setAuth(data) {
      this.user = data.user;
      this.token = data.token;
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
});
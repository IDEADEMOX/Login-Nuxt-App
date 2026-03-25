<template>
  <div class="auth-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="form.email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="form.password" required />
      </div>
      <button type="submit" class="btn">Login</button>
      <div class="register-link">
        Don't have an account? <NuxtLink to="/auth/register">Register</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFetch } from 'nuxt/app'

const router = useRouter()
const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  // 这里可以添加登录逻辑
  console.log('Login form submitted:', form.value)
  const response = await useFetch('/login', {
    method: 'POST',
    body: form.value
  })
  console.log('Login response:', response.data.value)
  if (response.data.value.code === 200) {
    localStorage.setItem('user', JSON.stringify(response.data.value.data))
    // 登录成功，跳转到首页
    router.push('/')
  } else {
    // 登录失败，显示错误消息
    alert(response.data.value.message)
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 10% auto 0;
  padding: 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.btn {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #45a049;
}

.register-link {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.register-link a {
  color: #4CAF50;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
<template>
  <div class="container">
    <h1>Welcome to Nuxt App</h1>
    <div class="auth-links">
      <NuxtLink to="/auth/login" class="btn">Login</NuxtLink>
      <NuxtLink to="/auth/register" class="btn">Register</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: #333;
}

.auth-links {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn {
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #45a049;
}
</style>
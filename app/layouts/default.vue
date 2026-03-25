<template>
  <div class="layout-container">
    <header class="header">
      <div class="header-right">
        <template v-if="isLoggedIn">
          <span class="username">
            {{ displayName }}
          </span>
          <button @click="handleLogout" class="logout-button">退出登录</button>
        </template>
        <template v-else>
          <div class="auth-links">
            <NuxtLink to="/auth/login" class="btn">Login</NuxtLink>
            <NuxtLink to="/auth/register" class="btn">Register</NuxtLink>
          </div>
        </template>
      </div>
    </header>
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute(); // 可选：用 route 而不是 router.currentRoute.value

const user = ref<any>({});

// 计算属性：是否已登录（推荐！模板里直接用）
const isLoggedIn = computed(() => !!user.value?.email);
// 用户名
const displayName = computed(() => {
  return (
    user.value?.name || user.value?.username || user.value?.email || "用户"
  );
});

// 加载用户函数
const loadUser = () => {
  if (import.meta.client) {
    const stored = localStorage.getItem("user");
    if (stored) {
      user.value = JSON.parse(stored);
    } else {
      user.value = {};
    }
  }
};
const handleProfile = async () => {
  if (!["/auth/login", "/auth/register"].includes(route.path)) {
    if (!user.value?.email) {
      return router.push("/auth/login");
    }
    await $fetch("/api/user/profile", {
      method: "POST",
      body: {
        id: user.value?.id,
      },
    }).then((res) => {
      const { code } = res;
      if (code === 200) {
        return router.push("/user/list");
      }
    });
  }
};

// 退出登录
const handleLogout = async () => {
  await $fetch("/logout", { method: "POST", body: { id: user.value?.id } });
  localStorage.removeItem("user");
  user.value = {}; // 立即清空响应式数据
  router.push("/auth/login");
};

onMounted(async () => {
  loadUser();
  handleProfile(); // 初始加载时也执行一次
  await nextTick();
});

watch(
  () => route.path, // 推荐用 useRoute() 的 path，更可靠
  async () => {
    loadUser();
    handleProfile();
    await nextTick(); // 等待 DOM 更新
  },
  { immediate: true }, // 重要！让 watch 一开始就执行
);
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.header-right {
  display: flex;
  gap: 1rem;
}

.username {
  font-size: 15px;
  color: #333;
  font-weight: 500;
  padding: 0.4rem 0.8rem;
  background-color: #f1f3f5;
  border-radius: 4px;
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.logout-button:hover {
  background-color: #c82333;
}

.main-content {
  flex: 1;
  padding: 1rem;
}

.auth-links {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn {
  padding: 12px 24px;
  background-color: #4caf50;
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

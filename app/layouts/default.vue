<template>
  <slot />
</template>

<script setup lang="ts">
    const router = useRouter()
    const handleProfile = async () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (!user.email) {
            return router.push('/auth/login')
        }
        await $fetch('/api/user/profile', {
            method: 'POST',
            body: {
                email: user.email
            }
        })
        console.log(router.currentRoute.value.path)
    }
    // 监听路由变化，每次路由变化时都调用 handleProfile 函数
    watch(() => router.currentRoute.value.path, (to, from) => {
        handleProfile()
    })
</script>

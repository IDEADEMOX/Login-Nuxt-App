<template>
  <div class="user-list-container">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1 class="page-title">
          <svg class="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          User Management
        </h1>
        <p class="page-subtitle">Manage your users efficiently</p>
      </div>
      
      <!-- 搜索和添加用户 -->
      <div class="header-actions">
        <div class="search-wrapper">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search by name or email..." 
            class="search-input"
          />
        </div>
        <button @click="openAddModal" class="btn add-btn">
          <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>
      
      <!-- 统计信息 -->
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-label">Total Users</span>
          <span class="stat-value">{{ users.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Showing</span>
          <span class="stat-value">{{ filteredUsers.length }}</span>
        </div>
      </div>
      
      <!-- 用户列表 -->
      <div class="user-table-wrapper">
        <table class="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Created At</th>
              <th class="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id" class="user-row">
              <td class="user-id">#{{ user.id }}</td>
              <td class="user-info">
                <div class="user-avatar">
                  {{ getInitials(user.username) }}
                </div>
                <span class="username">{{ user.username }}</span>
              </td>
              <td class="user-email">
                <a :href="`mailto:${user.email}`" class="email-link">
                  {{ user.email }}
                </a>
              </td>
              <td class="user-date">
                <svg class="date-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button @click="editUser(user)" class="action-btn edit-btn" title="Edit">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="deleteUser(user.id as string)" class="action-btn delete-btn" title="Delete">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 空状态 -->
      <div v-if="filteredUsers.length === 0" class="empty-state">
        <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <p class="empty-text">No users found</p>
        <p class="empty-subtext">Try adjusting your search or add a new user</p>
      </div>
    </div>
    
    <!-- 添加/编辑用户模态框 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">{{ isEditing ? 'Edit User' : 'Add New User' }}</h2>
          <button class="modal-close" @click="closeModal">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="saveUser" class="modal-form">
          <div class="form-group">
            <label for="username" class="form-label">
              <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Username
            </label>
            <input 
              type="text" 
              id="username" 
              v-model="form.username" 
              class="form-input"
              placeholder="Enter username"
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="email" class="form-label">
              <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email" 
              class="form-input"
              placeholder="user@example.com"
              required 
            />
          </div>
          
          <!-- 只在创建时显示密码字段，编辑时隐藏 -->
          <div v-if="!isEditing" class="form-group">
            <label for="password" class="form-label">
              <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4V6a4 4 0 00-8 0v4h8z" />
              </svg>
              Password
            </label>
            <input 
              type="password" 
              id="password" 
              v-model="form.password" 
              class="form-input"
              placeholder="Enter password"
              required 
            />
            <div class="form-hint">Password must be at least 6 characters</div>
          </div>
          
          <!-- 编辑时显示提示信息 -->
          <div v-else class="info-message">
            <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Password cannot be changed in edit mode</span>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn cancel-btn">Cancel</button>
            <button type="submit" class="btn save-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ isEditing ? 'Update User' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { $fetch } from 'ofetch'

// 类型定义
interface User {
  id?: string
  username: string
  email: string
  password?: string
  createdAt: string
}

// 状态管理
const users = ref<User[]>([])
const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const form = ref({
  username: '',
  email: '',
  password: ''
})

// 过滤用户
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.username.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  )
})

// 获取用户名首字母
const getInitials = (name: string) => {
  return name.charAt(0).toUpperCase()
}

// 加载用户列表
const loadUsers = async () => {
  try {
    const response = await $fetch('/api/user/list')
    users.value = response.data || []
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

// 打开添加模态框
const openAddModal = () => {
  isEditing.value = false
  resetForm()
  showModal.value = true
}

// 编辑用户
const editUser = (user: User) => {
  isEditing.value = true
  form.value = {
    ...user,
    username: user.username,
    email: user.email,
    password: '' // 编辑时清空密码字段
  }
  showModal.value = true
}

// 保存用户
const saveUser = async () => {
  try {
    let response
    if (isEditing.value) {
      // 编辑时，不发送密码字段
      const { password, ...updateData } = form.value
      response = await $fetch('/api/user/update', {
        method: 'POST',
        body: updateData
      })
    } else {
      // 创建时，验证密码不为空
      if (!form.value.password) {
        alert('Please enter a password')
        return
      }
      response = await $fetch('/api/user/create', {
        method: 'POST',
        body: form.value
      })
    }
    
    if (response.success) {
      await loadUsers()
      closeModal()
    } else {
      alert(response.message || 'Operation failed')
    }
  } catch (error) {
    console.error('Error saving user:', error)
    alert('An error occurred while saving the user')
  }
}

// 删除用户
const deleteUser = async (id: string) => {
  if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
    try {
      const response = await $fetch('/api/user/delete', {
        method: 'POST',
        body: { id }
      })
      
      if (response.success) {
        await loadUsers()
      } else {
        alert(response.message || 'Delete failed')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('An error occurred while deleting the user')
    }
  }
}

// 关闭模态框
const closeModal = () => {
  showModal.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  form.value = {
    username: '',
    email: '',
    password: ''
  }
  isEditing.value = false
}

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 组件挂载时加载用户列表
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
/* 基础容器 */
.user-list-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  padding: 2rem;
}

/* 页面头部 */
.page-header {
  margin-bottom: 2rem;
  text-align: center;
}

.page-title {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.title-icon {
  width: 2rem;
  height: 2rem;
  color: #667eea;
}

.page-subtitle {
  color: #6b7280;
  font-size: 0.95rem;
}

/* 操作栏 */
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.search-wrapper {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

/* 统计栏 */
.stats-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

/* 表格 */
.user-table-wrapper {
  overflow-x: auto;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table thead {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.user-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.user-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.user-row:hover {
  background: #f9fafb;
  transition: background 0.3s ease;
}

/* 操作列表头 */
.actions-header {
  text-align: center;
  width: 100px;
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
}

.username {
  font-weight: 500;
  color: #1f2937;
}

.user-id {
  font-weight: 500;
  color: #9ca3af;
  font-size: 0.875rem;
}

.user-email .email-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.user-email .email-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.user-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.date-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

/* 操作按钮单元格 */
.actions-cell {
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
}

.action-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.edit-btn {
  color: #667eea;
}

.edit-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: scale(1.1);
}

.delete-btn {
  color: #ef4444;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  transform: scale(1.1);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  color: #d1d5db;
}

.empty-text {
  font-size: 1.125rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.empty-subtext {
  font-size: 0.875rem;
  color: #9ca3af;
}

/* 模态框 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close svg {
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

.modal-close:hover {
  background: #f3f4f6;
}

.modal-close:hover svg {
  color: #374151;
}

.modal-form {
  padding: 1.5rem;
}

/* 表单样式 */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.label-icon {
  width: 1rem;
  height: 1rem;
  color: #667eea;
}

.form-input {
  width: 100%;
  padding: 0.75rem 0;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-hint {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.info-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #fef3c7;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  color: #92400e;
  font-size: 0.875rem;
}

.info-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: #f59e0b;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.cancel-btn {
  background: #f3f4f6;
  color: #6b7280;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-list-container {
    padding: 1rem;
  }
  
  .container {
    padding: 1rem;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-wrapper {
    max-width: 100%;
  }
  
  .stats-bar {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .user-table th,
  .user-table td {
    padding: 0.75rem;
  }
  
  .action-buttons {
    flex-direction: row;
    gap: 0.25rem;
  }
}
</style>
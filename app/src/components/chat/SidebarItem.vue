<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Session } from '@/stores/session'

defineProps<{
  session: Session
  isActive: boolean
}>()

defineEmits<{
  (e: 'select'): void
  (e: 'delete'): void
}>()
</script>

<template>
  <div 
    class="sidebar-item"
    :class="{ 'sidebar-item--active': isActive }"
    @click="$emit('select')"
  >
    <span class="sidebar-item__title">{{ session.title }}</span>
    <button 
      class="sidebar-item__delete"
      @click.stop="$emit('delete')"
      title="删除对话"
    >
      ×
    </button>
  </div>
</template>

<style scoped>
.sidebar-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  margin: 2px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s;
}

.sidebar-item:hover {
  background-color: #f3f4f6;
}

.sidebar-item--active {
  background-color: #e5e7eb;
}

.sidebar-item--active:hover {
  background-color: #d1d5db;
}

.sidebar-item__title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  color: #374151;
}

.sidebar-item__delete {
  display: none;
  padding: 2px 6px;
  font-size: 16px;
  color: #9ca3af;
  background: none;
  border: none;
  cursor: pointer;
}

.sidebar-item:hover .sidebar-item__delete {
  display: block;
}

.sidebar-item__delete:hover {
  color: #ef4444;
}
</style>
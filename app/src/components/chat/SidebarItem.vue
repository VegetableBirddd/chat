<script setup lang="ts">
// defineProps and defineEmits are compiler macros in <script setup>, no need to import
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
    class="sidebar-item relative flex items-center justify-between mx-2 px-4 py-3 rounded-lg cursor-pointer transition-all duration-150"
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
  color: var(--text-sidebar);
}

.sidebar-item:hover {
  background-color: #f0eeeb;
}

.sidebar-item--active {
  background-color: var(--accent-user);
  color: var(--text-primary);
  position: relative;
}

.sidebar-item--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background-color: var(--accent-primary);
  border-radius: 0 2px 2px 0;
}

.sidebar-item__title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  padding-right: 24px;
}

.sidebar-item__delete {
  position: absolute;
  right: 8px;
  display: none;
  padding: 4px 8px;
  font-size: 16px;
  color: var(--text-tertiary);
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 150ms ease-out;
}

.sidebar-item:hover .sidebar-item__delete {
  display: block;
}

.sidebar-item__delete:hover {
  color: var(--accent-error);
  background-color: rgba(239, 68, 68, 0.1);
}
</style>
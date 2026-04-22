<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue'
import { useSessionStore } from '@/stores/session'
import SidebarItem from './SidebarItem.vue'

const sessionStore = useSessionStore()
const listRef = ref<HTMLElement>()

const sessions = computed(() => sessionStore.sessions)
const currentSessionId = computed(() => sessionStore.currentSessionId)

function handleCreate() {
  sessionStore.createSession()
  nextTick(() => {
    if (listRef.value) {
      listRef.value.scrollTop = 0
    }
  })
}

function handleSelect(id: string) {
  sessionStore.switchSession(id)
}

function handleDelete(id: string) {
  sessionStore.deleteSession(id)
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__header">
      <button class="sidebar__new-btn" @click="handleCreate">
        + 新建对话
      </button>
    </div>
    <div ref="listRef" class="sidebar__list">
      <SidebarItem
        v-for="session in sessions"
        :key="session.id"
        :session="session"
        :is-active="session.id === currentSessionId"
        @select="handleSelect(session.id)"
        @delete="handleDelete(session.id)"
      />
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  min-width: 240px;
  height: 100vh;
  background-color: #fafafa;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}

.sidebar__header {
  padding: 16px 12px;
  border-bottom: 1px solid #e5e7eb;
}

.sidebar__new-btn {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  color: #374151;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.sidebar__new-btn:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.sidebar__list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.sidebar__list::-webkit-scrollbar {
  width: 4px;
}

.sidebar__list::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}

.sidebar__list::-webkit-scrollbar-track {
  background: transparent;
}
</style>
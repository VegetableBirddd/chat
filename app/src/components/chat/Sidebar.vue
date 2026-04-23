<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import { useSessionStore } from '@/stores/session'
import SidebarItem from './SidebarItem.vue'
import SearchPanel from './SearchPanel.vue'

const sessionStore = useSessionStore()
const listRef = ref<HTMLElement>()
const showSearch = ref(false)

const sessions = computed(() => sessionStore.sessions)
const currentSessionId = computed(() => sessionStore.currentSessionId)

function handleCreate() {
  sessionStore.createSession()
  nextTick(() => {
    if (listRef.value) {
      listRef.value.scrollTop = listRef.value.scrollHeight
    }
  })
}

function handleSelect(id: string) {
  sessionStore.switchSession(id)
}

function handleDelete(id: string) {
  sessionStore.deleteSession(id)
}

function handleSearchSelect(sessionId: string, _messageId?: string) {
  sessionStore.switchSession(sessionId)
  showSearch.value = false
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__header">
      <button class="sidebar__new-btn" @click="handleCreate">
        + 新建对话
      </button>
      <button class="sidebar__search-btn" @click="showSearch = true">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        搜索
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
    <SearchPanel
      v-if="showSearch"
      :sessions="sessions"
      @select="handleSearchSelect"
      @close="showSearch = false"
    />
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  min-width: 260px;
  height: 100vh;
  background-color: var(--bg-sidebar);
  border-right: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
}

.sidebar__header {
  padding: 16px 12px;
  border-bottom: 1px solid var(--border-default);
}

.sidebar__new-btn {
  width: 100%;
  padding: 10px 16px;
  font-size: 14px;
  color: var(--text-sidebar);
  background-color: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.sidebar__new-btn:hover {
  background-color: var(--bg-hover);
  border-color: var(--border-hover);
}

.sidebar__search-btn {
  width: 100%;
  margin-top: 8px;
  padding: 10px 16px;
  font-size: 14px;
  color: var(--text-secondary);
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.sidebar__search-btn:hover {
  background-color: var(--bg-hover);
  color: var(--text-sidebar);
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
  background-color: var(--border-hover);
  border-radius: 4px;
}

.sidebar__list::-webkit-scrollbar-track {
  background: transparent;
}
</style>
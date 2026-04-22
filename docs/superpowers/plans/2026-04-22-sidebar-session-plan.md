# 侧边栏会话管理功能实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 AI Chat 应用添加左侧边栏，支持会话历史管理和多会话切换功能

**Architecture:** 新增 Sidebar 组件 + Session Store，通过 localStorage 持久化会话数据

**Tech Stack:** Vue 3 + TypeScript + Pinia + localStorage

---

## 文件结构

| 类型 | 文件 | 职责 |
|------|------|------|
| Store | `src/stores/session.ts` | 会话状态管理：创建/切换/删除/持久化 |
| Store | `src/stores/chat.ts` | 修改：同步消息到 session |
| 组件 | `src/components/chat/Sidebar.vue` | 侧边栏容器 |
| 组件 | `src/components/chat/SidebarItem.vue` | 单个会话项 |
| 布局 | `src/App.vue` | 调整布局：添加 Sidebar |

---

## Task 1: 创建 Session Store

**Files:**
- Create: `app/src/stores/session.ts`

- [ ] **Step 1: 创建 session.ts store**

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Message } from '@/types'

export interface Session {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = 'ai-chat-sessions'

export const useSessionStore = defineStore('session', () => {
  const sessions = ref<Session[]>([])
  const currentSessionId = ref<string | null>(null)

  const currentSession = computed(() => 
    sessions.value.find(s => s.id === currentSessionId.value)
  )

  function createSession(): string {
    const id = crypto.randomUUID()
    const now = Date.now()
    sessions.value.unshift({
      id,
      title: '新对话',
      messages: [],
      createdAt: now,
      updatedAt: now
    })
    currentSessionId.value = id
    saveToStorage()
    return id
  }

  function switchSession(id: string) {
    if (sessions.value.some(s => s.id === id)) {
      currentSessionId.value = id
    }
  }

  function deleteSession(id: string) {
    const index = sessions.value.findIndex(s => s.id === id)
    if (index > -1) {
      sessions.value.splice(index, 1)
      if (currentSessionId.value === id) {
        currentSessionId.value = sessions.value[0]?.id ?? null
      }
      saveToStorage()
    }
  }

  function updateSessionTitle(id: string, title: string) {
    const session = sessions.value.find(s => s.id === id)
    if (session) {
      session.title = title.slice(0, 50)
      session.updatedAt = Date.now()
      saveToStorage()
    }
  }

  function updateSessionMessages(id: string, messages: Message[]) {
    const session = sessions.value.find(s => s.id === id)
    if (session) {
      session.messages = messages
      session.updatedAt = Date.now()
      if (session.title === '新对话' && messages.length > 0) {
        const firstUserMsg = messages.find(m => m.role === 'user')
        if (firstUserMsg) {
          session.title = firstUserMsg.content.slice(0, 50)
        }
      }
      saveToStorage()
    }
  }

  function getSessionMessages(id: string): Message[] {
    return sessions.value.find(s => s.id === id)?.messages ?? []
  }

  function loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        sessions.value = JSON.parse(data)
        currentSessionId.value = sessions.value[0]?.id ?? null
      }
    } catch (e) {
      console.error('Failed to load sessions:', e)
      sessions.value = []
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.value))
    } catch (e) {
      console.error('Failed to save sessions:', e)
    }
  }

  return {
    sessions,
    currentSessionId,
    currentSession,
    createSession,
    switchSession,
    deleteSession,
    updateSessionTitle,
    updateSessionMessages,
    getSessionMessages,
    loadFromStorage,
    saveToStorage
  }
})
```

- [ ] **Step 2: 提交**

```bash
git add app/src/stores/session.ts
git commit -m "feat: add session store for conversation management"
```

---

## Task 2: 创建 SidebarItem 组件

**Files:**
- Create: `app/src/components/chat/SidebarItem.vue`

- [ ] **Step 1: 创建 SidebarItem.vue**

```vue
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Session } from '@/stores/session'

const props = defineProps<{
  session: Session
  isActive: boolean
}>()

const emit = defineEmits<{
  (e: 'select'): void
  (e: 'delete'): void
}>()
</script>

<template>
  <div 
    class="sidebar-item"
    :class="{ 'sidebar-item--active': isActive }"
    @click="emit('select')"
  >
    <span class="sidebar-item__title">{{ session.title }}</span>
    <button 
      class="sidebar-item__delete"
      @click.stop="emit('delete')"
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
```

- [ ] **Step 2: 提交**

```bash
git add app/src/components/chat/SidebarItem.vue
git commit -m "feat: add SidebarItem component"
```

---

## Task 3: 创建 Sidebar 组件

**Files:**
- Create: `app/src/components/chat/Sidebar.vue`

- [ ] **Step 1: 创建 Sidebar.vue**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useSessionStore } from '@/stores/session'
import SidebarItem from './SidebarItem.vue'

const sessionStore = useSessionStore()

const sessions = computed(() => sessionStore.sessions)
const currentSessionId = computed(() => sessionStore.currentSessionId)

function handleCreate() {
  sessionStore.createSession()
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
    <div class="sidebar__list">
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
</style>
```

- [ ] **Step 2: 提交**

```bash
git add app/src/components/chat/Sidebar.vue
git commit -m "feat: add Sidebar component"
```

---

## Task 4: 修改 App.vue 添加布局

**Files:**
- Modify: `app/src/App.vue`

- [ ] **Step 1: 修改 App.vue**

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import ChatContainer from './components/chat/ChatContainer.vue'
import Sidebar from './components/chat/Sidebar.vue'
import { useSessionStore } from './stores/session'

const sessionStore = useSessionStore()

onMounted(() => {
  sessionStore.loadFromStorage()
  if (sessionStore.sessions.length === 0) {
    sessionStore.createSession()
  } else {
    sessionStore.switchSession(sessionStore.sessions[0].id)
  }
})
</script>

<template>
  <div class="app-layout">
    <Sidebar />
    <ChatContainer />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow: hidden;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add app/src/App.vue
git commit -m "feat: add sidebar layout to App.vue"
```

---

## Task 5: 修改 ChatContainer 同步消息到 Session

**Files:**
- Modify: `app/src/components/chat/ChatContainer.vue`

需要修改 handleSend 函数，在发送消息后同步到 sessionStore，以及初始化时从 sessionStore 加载消息。

- [ ] **Step 1: 修改 ChatContainer.vue 同步消息**

在 script setup 中添加 sessionStore 引用，并修改相关逻辑：

```vue
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useSessionStore } from '@/stores/session'
import { sendChatMessage, isConfigured } from '@/services/api'
import MessageList from './MessageList.vue'
import InputBox from './InputBox.vue'

const chatStore = useChatStore()
const sessionStore = useSessionStore()
const messageListRef = ref<InstanceType<typeof MessageList>>()

const messages = computed(() => chatStore.messages)
const isLoading = computed(() => chatStore.isLoading)
const canSend = computed(() => isConfigured())

onMounted(() => {
  if (sessionStore.currentSessionId) {
    const saved = sessionStore.getSessionMessages(sessionStore.currentSessionId)
    chatStore.messages = [...saved]
  }
})

watch(messages, (newMessages) => {
  if (sessionStore.currentSessionId) {
    sessionStore.updateSessionMessages(sessionStore.currentSessionId, [...newMessages])
  }
}, { deep: true })

async function handleSend(content: string) {
  if (!canSend.value) {
    chatStore.setError('请配置 DeepSeek API Key')
    return
  }

  chatStore.addMessage('user', content)
  chatStore.setLoading(true)
  chatStore.setError(null)

  chatStore.addMessage('assistant', '')

  try {
    const chatMessages = messages.value.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    await sendChatMessage(chatMessages, (content) => {
      chatStore.updateLastMessage(content)
    })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : '发送失败'
    chatStore.setError(errMsg)
    chatStore.updateLastMessage('[发送失败]')
  } finally {
    chatStore.setLoading(false)
  }
}

function handleClear() {
  chatStore.clearMessages()
  if (sessionStore.currentSessionId) {
    sessionStore.updateSessionMessages(sessionStore.currentSessionId, [])
  }
}
</script>
```

- [ ] **Step 2: 提交**

```bash
git add app/src/components/chat/ChatContainer.vue
git commit -m "feat: sync messages with session store"
```

- [ ] **Step 3: 运行 typecheck 验证**

```bash
cd app && npm run typecheck
```

---

## 执行选择

计划已完成并保存到 `docs/superpowers/plans/2026-04-22-sidebar-session-plan.md`。两种执行方式：

1. **Subagent-Driven (推荐)** - 我为每个任务分配子代理，任务间审查，快速迭代

2. **Inline Execution** - 在此会话中使用 executing-plans 批量执行，带审查点

选择哪种方式?

---

## 运行状态

### 已完成

- [x] Task 1: 创建 Session Store
- [x] Task 2: 创建 SidebarItem 组件
- [x] Task 3: 创建 Sidebar 组件
- [x] Task 4: 修改 App.vue 添加布局
- [x] Task 5: 修改 ChatContainer 同步消息到 Session

### Bug 修复

- **Task 6: 修复空聊天时右侧区域宽度太窄**
  - 文件: `app/src/components/chat/ChatContainer.vue`
  - 修改: 根 div 添加 `flex-1` 类
  - 提交: `b436768 fix: 修复空聊天宽度和sidebar hover高度问题`

- **Task 7: 修复 MessageList 空状态布局**
  - 文件: `app/src/components/chat/MessageList.vue`
  - 修改: 空状态 div 添加 `flex-1`，外层容器添加 `display: flex` + `flex-direction: column`

- **Task 8: 修复 SidebarItem hover 时高度变化**
  - 文件: `app/src/components/chat/SidebarItem.vue`
  - 修改: 删除按钮改为 `position: absolute` 绝对定位，不再占用布局空间
# 侧边栏会话管理功能设计

## 1. 概述

为 AI Chat 应用添加左侧边栏，支持会话历史管理和多会话切换功能。会话数据存储在 localStorage 中，刷新页面后可恢复。

## 2. 数据模型

### 2.1 Session 接口

```typescript
interface Session {
  id: string           // 会话唯一ID (UUID)
  title: string        // 会话标题 (首条用户消息截取，max 50 chars)
  messages: Message[]  // 消息历史
  createdAt: number  // 创建时间戳
  updatedAt: number  // 更新时间戳
}
```

### 2.2 存储键

- localStorage key: `ai-chat-sessions`
- 存储格式: `Session[]` (JSON stringified)

## 3. 布局结构

```
┌─────────┬───────────────────────────────────────┐
│ Sidebar │ Content Area                         │
│ ─────── │                                     │
│ [+新建] │ Header                              │
│ ─────── │ ─────────────────────────────────── │
│ 会话1   │                                     │
│ 会话2   │        MessageList                 │
│ ...    │                                     │
│        │                                     │
│        │ ─────────────────────────────────── │
│        │        InputBox                     │
└─────────┴───────────────────────────────────────┘
```

- Sidebar 宽度: 240px (固定)
- 布局: flex-row
- Sidebar 最小高度: 100vh

## 4. 组件设计

### 4.1 Sidebar.vue

- 位置: `src/components/chat/Sidebar.vue`
- 职责: 渲染会话列表，提供新建/切换/删除功能

### 4.2 SidebarItem.vue

- 位置: `src/components/chat/SidebarItem.vue`
- 职责: 单个会话项显示，支持 hover 显示删除按钮

## 5. Store 设计

### 5.1 session.ts

- 位置: `src/stores/session.ts`

#### 状态

```typescript
const sessions = ref<Session[]>([])
const currentSessionId = ref<string | null>(null)
```

#### 方法

| 方法 | 描述 |
|------|------|
| `createSession()` | 创建新会话，返回 session id |
| `switchSession(id)` | 切换当前会话，加载消息到 chatStore |
| `deleteSession(id)` | 删除指定会话 |
| `loadFromStorage()` | 从 localStorage 加载 |
| `saveToStorage()` | 保存到 localStorage |

### 5.2 与 chatStore 的交互

- 切换会话时，将 session.messages 赋值给 chatStore.messages
- 发送消息时，同步将消息保存到当前 session

## 6. 数据流

```
用户点击会话 → sessionStore.switchSession(id) 
            → 清空 chatStore.messages
            → 加载当前会话 messages
            → 渲染 MessageList
```

## 7. App.vue 改造

- 将 ChatContainer 包裹在 flex container 中
- 左侧添加 Sidebar 组件
- 调整样式: Sidebar 宽度 240px，右侧 flex-1

## 8. 边界情况处理

1. **无会话时**: 显示"新建对话"按钮，点击创建第一个会话
2. **删除当前会话**: 自动切换到上一个会话，无会话则创建新会话
3. **首条消息为空**: 使用"新对话"作为默认标题
4. **localStorage 满**: 提示用户删除旧会话

## 9. 实现任务

1. 创建 `src/stores/session.ts`
2. 创建 `src/components/chat/Sidebar.vue`
3. 创建 `src/components/chat/SidebarItem.vue`
4. 修改 `src/App.vue` 添加布局
5. 修改 `src/components/chat/ChatContainer.vue` 同步消息到 session

## 10. 验收标准

- [ ] 左侧边栏显示历史会话列表（按时间倒序）
- [ ] 点击"新建对话"创建新会话并切换
- [ ] 点击历史会话切换并加载消息
- [ ] 发送消息自动保存到当前会话
- [ ] 刷新页面后会话历史恢复
- [ ] 可删除单个会话
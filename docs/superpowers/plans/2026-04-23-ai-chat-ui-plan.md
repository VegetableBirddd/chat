# AI Chat UI 改造实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 AI Chat 应用 UI 改造为现代极简风格，使用暖白配色系统

**Architecture:** 基于现有 Vue 3 + Tailwind CSS 架构，通过更新 CSS 变量和组件样式实现视觉升级。保持所有现有功能，仅修改视觉效果。

**Tech Stack:** Vue 3, TypeScript, Tailwind CSS, Vite

---

## 文件结构

| 文件 | 责任 | 修改类型 |
|------|------|----------|
| `app/src/style.css` | CSS 变量定义、全局样式 | 修改 |
| `app/src/components/chat/Sidebar.vue` | 侧边栏布局和样式 | 修改 |
| `app/src/components/chat/SidebarItem.vue` | 会话列表项样式 | 修改 |
| `app/src/components/chat/ChatContainer.vue` | 聊天容器头部和布局 | 修改 |
| `app/src/components/chat/MessageList.vue` | 消息列表空状态和加载动画 | 修改 |
| `app/src/components/chat/ChatMessage.vue` | 消息气泡样式和操作按钮 | 修改 |
| `app/src/components/chat/InputBox.vue` | 输入框和按钮样式 | 修改 |
| `app/src/components/chat/CodeBlock.vue` | 代码块浅色主题 | 修改 |
| `app/src/components/chat/FilePreview.vue` | 文件预览卡片样式 | 修改 |
| `app/src/components/chat/FileUpload.vue` | 文件上传区域样式 | 修改 |

---

## 实施任务

### Task 1: 添加 CSS 变量定义

**Files:**
- Modify: `app/src/style.css`

- [ ] **Step 1: 在 style.css 中添加 CSS 变量**

在文件开头添加 CSS 变量定义：

```css
@import "tailwindcss";

/* Import highlight.js theme */
@import 'highlight.js/styles/github.css';

/* CSS Variables for Modern Minimal Design */
:root {
  /* 背景 */
  --bg-page: #faf9f7;
  --bg-sidebar: #f5f4f2;
  --bg-card: #ffffff;
  --bg-input: #f5f4f2;
  --bg-code: #f8f9fa;
  --bg-code-header: #f0eeeb;
  
  /* 文字 */
  --text-primary: #1a1a1a;
  --text-secondary: #6b6b6b;
  --text-tertiary: #9ca3af;
  --text-sidebar: #374151;
  
  /* 强调色 */
  --accent-primary: #2563eb;
  --accent-hover: #1d4ed8;
  --accent-user: #e8e4f9;
  --accent-success: #10b981;
  --accent-error: #ef4444;
  
  /* 边框 */
  --border-default: #e8e6e3;
  --border-hover: #d1d5db;
  --border-divider: #f0eeeb;
  
  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  
  /* 过渡 */
  --transition-fast: 150ms ease-out;
}

/* 全局过渡 */
* {
  transition: background-color var(--transition-fast),
              border-color var(--transition-fast),
              color var(--transition-fast),
              opacity var(--transition-fast);
}
```

- [ ] **Step 2: 保留现有的代码块样式**

确保以下样式保留在文件末尾：

```css
/* Custom styles for code blocks */
.hljs {
  background: transparent !important;
  padding: 0 !important;
}

.code-block pre code.hljs {
  display: block;
  overflow-x: auto;
}

.code-block .line-numbers {
  user-select: none;
}
```

- [ ] **Step 3: 运行类型检查**

Run: `cd app && npm run typecheck`
Expected: 无错误

- [ ] **Step 4: Commit**

```bash
git add app/src/style.css
git commit -m "feat: add CSS variables for modern minimal design"
```

---

### Task 2: 更新 Sidebar 组件

**Files:**
- Modify: `app/src/components/chat/Sidebar.vue`

- [ ] **Step 1: 更新模板中的样式类**

将 aside 标签的样式更新：

```vue
<aside class="w-[260px] min-w-[260px] h-screen flex flex-col" style="background-color: var(--bg-sidebar); border-right: 1px solid var(--border-default);">
```

- [ ] **Step 2: 更新头部按钮样式**

更新新建对话按钮：

```vue
<button 
  class="w-full px-4 py-2.5 text-sm rounded-lg border transition-all duration-150"
  style="background-color: var(--bg-card); border-color: var(--border-default); color: var(--text-sidebar);"
  @click="handleCreate"
>
  + 新建对话
</button>
```

更新搜索按钮：

```vue
<button 
  class="w-full mt-2 px-4 py-2.5 text-sm rounded-lg flex items-center justify-center gap-1.5 transition-all duration-150"
  style="background-color: transparent; color: var(--text-secondary);"
  @click="showSearch = true"
>
  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
  搜索
</button>
```

- [ ] **Step 3: 更新 scoped 样式**

将 style scoped 部分替换为：

```vue
<style scoped>
.sidebar__header {
  padding: 16px 12px;
  border-bottom: 1px solid var(--border-default);
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
```

- [ ] **Step 4: 运行类型检查**

Run: `cd app && npm run typecheck`
Expected: 无错误

- [ ] **Step 5: Commit**

```bash
git add app/src/components/chat/Sidebar.vue
git commit -m "feat: update Sidebar with modern minimal design"
```

---

### Task 3: 更新 SidebarItem 组件

**Files:**
- Modify: `app/src/components/chat/SidebarItem.vue`

- [ ] **Step 1: 更新模板中的样式类**

将会话项容器更新：

```vue
<div 
  class="sidebar-item relative flex items-center justify-between mx-2 px-4 py-3 rounded-lg cursor-pointer transition-all duration-150"
  :class="{ 'sidebar-item--active': isActive }"
  @click="$emit('select')"
>
```

- [ ] **Step 2: 更新 scoped 样式**

将 style scoped 部分完全替换为：

```vue
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
```

- [ ] **Step 3: 运行类型检查**

Run: `cd app && npm run typecheck`
Expected: 无错误

- [ ] **Step 4: Commit**

```bash
git add app/src/components/chat/SidebarItem.vue
git commit -m "feat: update SidebarItem with modern minimal design"
```

---

### Task 4: 更新 ChatContainer 组件

**Files:**
- Modify: `app/src/components/chat/ChatContainer.vue`

- [ ] **Step 1: 更新主容器背景**

将主容器 div 的样式更新：

```vue
<div class="flex-1 flex flex-col h-screen" style="background-color: var(--bg-page);">
```

- [ ] **Step 2: 更新头部样式**

将 header 样式更新：

```vue
<header class="flex items-center justify-between px-6 py-4" style="border-bottom: 1px solid var(--border-divider); background-color: var(--bg-card);">
  <h1 class="text-lg font-semibold" style="color: var(--text-primary);">AI Chat</h1>
  <div class="flex items-center gap-4">
    <button
      v-if="messages.length > 0"
      @click="showExportDialog = true"
      class="text-sm transition-colors duration-150"
      style="color: var(--text-secondary);"
      onmouseover="this.style.color='var(--text-primary)'"
      onmouseout="this.style.color='var(--text-secondary)'"
    >
      导出
    </button>
    <button
      v-if="messages.length > 0"
      @click="handleClear"
      class="text-sm transition-colors duration-150"
      style="color: var(--text-secondary);"
      onmouseover="this.style.color='var(--text-primary)'"
      onmouseout="this.style.color='var(--text-secondary)'"
    >
      清除对话
    </button>
  </div>
</header>
```

- [ ] **Step 3: 更新 API Key 提示条样式**

将提示条 div 更新：

```vue
<div v-if="!canSend" class="px-6 py-3" style="background-color: #fef9c3; border-top: 1px solid #fde047;">
  <p class="text-sm" style="color: #854d0e;">
    请在 .env 中配置 VITE_DEEPSEEK_API_KEY
  </p>
</div>
```

- [ ] **Step 4: 运行类型检查**

Run: `cd app && npm run typecheck`
Expected: 无错误

- [ ] **Step 5: Commit**

```bash
git add app/src/components/chat/ChatContainer.vue
git commit -m "feat: update ChatContainer with modern minimal design"
```

---

### Task 5: 更新 MessageList 组件

**Files:**
- Modify: `app/src/components/chat/MessageList.vue`

- [ ] **Step 1: 更新空状态样式**

将空状态 div 更新：

```vue
<div v-if="props.messages.length === 0" class="flex-1 flex flex-col items-center justify-center">
  <svg class="w-12 h-12 mb-4" style="color: var(--text-tertiary); opacity: 0.5;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
  <p class="text-sm" style="color: var(--text-tertiary);">开始新的对话</p>
</div>
```

- [ ] **Step 2: 更新加载动画样式**

将加载状态 div 更新：

```vue
<div v-if="props.isLoading" class="flex gap-3 py-4">
  <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium" style="background-color: var(--bg-sidebar); color: var(--text-secondary); border: 1px solid var(--border-default);">
    AI
  </div>
  <div class="flex items-center gap-1">
    <span class="w-1.5 h-1.5 rounded-full animate-bounce" style="background-color: var(--text-tertiary); animation-delay: 0ms;"></span>
    <span class="w-1.5 h-1.5 rounded-full animate-bounce" style="background-color: var(--text-tertiary); animation-delay: 150ms;"></span>
    <span class="w-1.5 h-1.5 rounded-full animate-bounce" style="background-color: var(--text-tertiary); animation-delay: 300ms;"></span>
  </div>
</div>
```

- [ ] **Step 3: 更新消息列表容器样式**

将 message-list 样式更新：

```vue
<style scoped>
.message-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0 1.5rem;
}

.message-list::-webkit-scrollbar {
  width: 4px;
}

.message-list::-webkit-scrollbar-thumb {
  background-color: var(--border-hover);
  border-radius: 4px;
}

.message-list::-webkit-scrollbar-track {
  background: transparent;
}
</style>
```

- [ ] **Step 4: 运行类型检查**

Run: `cd app && npm run typecheck`
Expected: 无错误

- [ ] **Step 5: Commit**

```bash
git add app/src/components/chat/MessageList.vue
git commit -m "feat: update MessageList with modern minimal design"
```

---

### Task 6: 更新 ChatMessage 组件

**Files:**
- Modify: `app/src/components/chat/ChatMessage.vue`

- [ ] **Step 1: 更新主容器样式**

将最外层 div 的 class 更新：

```vue
<div
  class="flex gap-3 py-4"
  :class="message.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
  @mouseenter="isHovered = true"
  @mouseleave="isHovered = false"
>
```

- [ ] **Step 2: 更新头像样式**

将头像 div 更新：

```vue
<div
  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0"
  style="border: 1px solid var(--border-default);"
  :style="message.role === 'user' ? { backgroundColor: 'var(--accent-user)', color: 'var(--text-primary)' } : { backgroundColor: 'var(--bg-sidebar)', color: 'var(--text-secondary)' }"
>
  {{ message.role === 'user' ? 'U' : 'AI' }}
</div>
```

- [ ] **Step 3: 更新消息气泡样式**

将用户消息气泡 div 更新：

```vue
<div
  v-else
  class="relative group px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
  style="max-width: 75%;"
  :style="message.role === 'user' ? { 
    backgroundColor: 'var(--accent-user)', 
    color: 'var(--text-primary)',
    borderRadius: '16px 16px 4px 16px'
  } : { 
    backgroundColor: 'var(--bg-card)', 
    color: 'var(--text-primary)',
    border: '1px solid var(--border-divider)',
    borderRadius: '16px 16px 16px 4px'
  }"
>
```

- [ ] **Step 4: 更新操作按钮样式**

将操作按钮容器 div 更新：

```vue
<div
  v-if="showActions"
  class="absolute -bottom-7 flex items-center gap-3"
  :class="message.role === 'user' ? 'right-0' : 'left-0'"
  style="animation: fadeIn 150ms ease-out;"
>
```

- [ ] **Step 5: 更新操作按钮颜色**

将所有操作按钮的 class 中的 `text-gray-500` 等替换为内联样式：

```vue
style="color: var(--text-secondary);"
```

- [ ] **Step 6: 更新时间戳样式**

将时间戳 span 更新：

```vue
<span class="text-xs mt-1 px-1" style="color: var(--text-tertiary);">{{ formatTime(message.timestamp) }}</span>
```

- [ ] **Step 7: 运行类型检查**

Run: `cd app && npm run typecheck`
Expected: 无错误

- [ ] **Step 8: Commit**

```bash
git add app/src/components/chat/ChatMessage.vue
git commit -m "feat: update ChatMessage with modern minimal design"
```

---

### Task 7: 更新 InputBox 组件

**Files:**
- Modify: `app/src/components/chat/InputBox.vue`

- [ ] **Step 1: 更新容器样式**

将外层 div 更新：

```vue
<div class="px-6 pb-6" style="background-color: var(--bg-card); border-top: 1px solid var(--border-divider);">
```

- [ ] **Step 2: 更新删除模式容器样式**

将删除模式 div 更新：

```vue
<div v-if="chatStore.isDeleting" class="rounded-2xl p-4 mt-4" style="background-color: var(--bg-input);">
  <p class="text-sm text-center mb-3" style="color: var(--text-secondary);">
    已选择 <span class="font-semibold" style="color: var(--text-primary);">{{ chatStore.selectedCount }}</span> 条消息
  </p>
```

- [ ] **Step 3: 更新输入区域样式**

将输入区域容器更新：

```vue
<div v-else class="flex flex-col gap-2 rounded-2xl p-3 mt-4" style="background-color: var(--bg-input);">
```

- [ ] **Step 4: 更新 textarea 样式**

将 textarea 更新：

```vue
<textarea
  ref="textareaRef"
  v-model="inputValue"
  placeholder="输入消息..."
  class="flex-1 bg-transparent resize-none outline-none text-sm py-2 px-2 max-h-48"
  style="background-color: transparent;"
  :disabled="isLoading"
  @keydown="handleKeydown"
  @input="adjustHeight"
  rows="1"
/>
```

- [ ] **Step 5: 更新发送按钮样式**

将发送按钮更新：

```vue
<button
  @click="handleSend"
  :disabled="!canSend"
  class="p-2 rounded-xl transition-colors shrink-0"
  :style="canSend ? { backgroundColor: 'var(--accent-primary)' } : { backgroundColor: 'var(--accent-user)' }"
>
  <svg class="w-5 h-5" :style="canSend ? { color: 'white' } : { color: 'var(--accent-primary)' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
</button>
```

- [ ] **Step 6: 运行类型检查**

Run: `cd app && npm run typecheck`
Expected: 无错误

- [ ] **Step 7: Commit**

```bash
git add app/src/components/chat/InputBox.vue
git commit -m "feat: update InputBox with modern minimal design"
```

---

### Task 8: 更新 CodeBlock 组件

**Files:**
- Modify: `app/src/components/chat/CodeBlock.vue`

- [ ] **Step 1: 更新容器样式**

将最外层 div 更新：

```vue
<div class="code-block rounded-lg overflow-hidden" style="background-color: var(--bg-code); border: 1px solid var(--border-divider);">
```

- [ ] **Step 2: 更新头部样式**

将头部 div 更新：

```vue
<div class="flex items-center justify-between px-4 py-2" style="background-color: var(--bg-code-header); border-bottom: 1px solid var(--border-default);">
```

- [ ] **Step 3: 更新头部文字样式**

将语言标签 span 更新：

```vue
<span class="text-xs font-mono" style="color: var(--text-secondary);">
  {{ codeBlock.language.toLowerCase() }}
</span>
```

将行数 span 更新：

```vue
<span class="text-xs" style="color: var(--text-tertiary);">
  {{ lineCount }} lines
</span>
```

- [ ] **Step 4: 更新复制按钮样式**

将复制按钮更新：

```vue
<button
  @click="handleCopy"
  class="flex items-center gap-1 px-3 py-1 text-xs rounded-md transition-colors"
  :style="isCopied ? { backgroundColor: '#d1fae5', color: 'var(--accent-success)' } : { backgroundColor: 'var(--bg-sidebar)', color: 'var(--text-secondary)' }"
>
```

- [ ] **Step 5: 更新行号区域样式**

将行号 div 更新：

```vue
<div v-if="showLineNumbers" class="line-numbers select-none text-right py-2 px-3 text-xs font-mono" style="background-color: var(--bg-sidebar); border-right: 1px solid var(--border-default); color: var(--text-tertiary);">
```

- [ ] **Step 6: 运行类型检查**

Run: `cd app && npm run typecheck`
Expected: 无错误

- [ ] **Step 7: Commit**

```bash
git add app/src/components/chat/CodeBlock.vue
git commit -m "feat: update CodeBlock with modern minimal design"
```

---

### Task 9: 更新 FilePreview 组件

**Files:**
- Modify: `app/src/components/chat/FilePreview.vue`

- [ ] **Step 1: 更新容器样式**

将外层 div 更新为横向滚动：

```vue
<div v-if="files.length > 0" class="flex gap-2 overflow-x-auto pb-2" style="scrollbar-width: none; -ms-overflow-style: none;">
```

- [ ] **Step 2: 更新文件卡片样式**

将文件卡片 div 更新：

```vue
<div
  v-for="file in files"
  :key="file.id"
  class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm shrink-0 group"
  style="background-color: var(--bg-card); border: 1px solid var(--border-default);"
>
```

- [ ] **Step 3: 更新文字样式**

将文件名 span 更新：

```vue
<span class="truncate max-w-[150px]" style="color: var(--text-sidebar);" :title="file.name">
  {{ file.name }}
</span>
```

将文件大小 span 更新：

```vue
<span class="text-xs" style="color: var(--text-tertiary);">{{ formatSize(file.size) }}</span>
```

- [ ] **Step 4: 运行类型检查**

Run: `cd app && npm run typecheck`
Expected: 无错误

- [ ] **Step 5: Commit**

```bash
git add app/src/components/chat/FilePreview.vue
git commit -m "feat: update FilePreview with modern minimal design"
```

---

### Task 10: 更新 FileUpload 组件

**Files:**
- Modify: `app/src/components/chat/FileUpload.vue`

- [ ] **Step 1: 更新拖放区域样式**

将拖放区域 div 更新：

```vue
<div
  class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors"
  :class="[
    isDragging
      ? 'border-blue-500'
      : 'hover:border-gray-400',
    isUploading ? 'opacity-50 cursor-not-allowed' : ''
  ]"
  style="border-color: var(--border-default);"
  @dragover="handleDragOver"
  @dragleave="handleDragLeave"
  @drop="handleDrop"
  @click="handleClick"
>
```

- [ ] **Step 2: 更新图标样式**

将图标 svg 更新：

```vue
<svg class="w-12 h-12 mb-2" style="color: var(--text-tertiary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
```

- [ ] **Step 3: 更新文字样式**

将主文字 span 更新：

```vue
<span class="text-sm" style="color: var(--text-secondary);">点击或拖拽上传文件</span>
```

将副文字 span 更新：

```vue
<span class="text-xs" style="color: var(--text-tertiary);">支持 PDF、Word、Excel、图片、文本（最多5个，单个10MB）</span>
```

- [ ] **Step 4: 运行类型检查**

Run: `cd app && npm run typecheck`
Expected: 无错误

- [ ] **Step 5: Commit**

```bash
git add app/src/components/chat/FileUpload.vue
git commit -m "feat: update FileUpload with modern minimal design"
```

---

## 验证清单

所有任务完成后，进行最终验证：

- [ ] 启动开发服务器: `cd app && npm run dev`
- [ ] 检查页面是否正常加载
- [ ] 验证侧边栏样式（暖白背景、蓝色激活状态）
- [ ] 验证消息气泡样式（用户靛蓝、AI 白色带边框）
- [ ] 验证输入框样式（灰色背景、白色容器）
- [ ] 验证代码块样式（浅色主题）
- [ ] 验证文件上传和预览样式
- [ ] 运行类型检查: `npm run typecheck`
- [ ] 所有检查通过后，提交最终版本

---

**计划版本**: 1.0  
**创建日期**: 2026-04-23  
**设计文档**: `docs/superpowers/specs/2026-04-23-ai-chat-ui-design.md`

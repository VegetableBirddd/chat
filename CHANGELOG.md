# 开发记录

## 2026-04-22

### 新增
- 初始化 Vue 3 + Vite + TypeScript 项目
- 配置 Tailwind CSS
- 安装 Pinia、VueUse、Axios 依赖
- 创建类型定义 (`src/types/index.ts`)
- 创建 Pinia 状态管理 (`src/stores/chat.ts`)
- 创建 DeepSeek API 服务 (`src/services/api.ts`)
- 创建聊天组件：
  - `ChatMessage.vue` - 消息气泡
  - `MessageList.vue` - 消息列表
  - `InputBox.vue` - 输入框
  - `ChatContainer.vue` - 主容器

### 配置
- 配置路径别名 `@/` 
- 添加环境变量配置 `.env.example` 和 `.env`

### 修复
- 修复 MessageList 组件中 props 引用问题
- 修复流式输出：axios 改用 Fetch API 实现
- 去除没有的库：VueUse、Axios 依赖

### 新增功能
- 添加左侧边栏会话管理：
  - `Sidebar.vue` - 侧边栏容器
  - `SidebarItem.vue` - 会话列表项
  - `stores/session.ts` - 会话状态管理
- 会话数据存储在 localStorage，支持历史恢复
- 支持新建/切换/删除会话
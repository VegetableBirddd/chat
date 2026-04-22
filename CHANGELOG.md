# 开发记录

## 2026-04-22

### 新增功能
- 消息气泡操作功能：hover 用户消息时显示删除/编辑/复制按钮
  - 复制：点击复制消息内容到剪贴板，带"已复制"反馈
  - 编辑：Inline 直接编辑模式，Enter 保存 ESC 取消
  - 删除：进入多选模式，可勾选会话内任意消息批量删除
  - 按钮悬浮在气泡左下角，不影响布局

### 修复
- 修复空聊天时右侧区域宽度太窄的问题：ChatContainer 添加 flex-1
- 修复 MessageList 空状态布局：添加 flex-1 和 display flex
- 修复 SidebarItem hover 时高度变化：删除按钮改为绝对定位

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
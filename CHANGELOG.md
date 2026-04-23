# 开发记录

## 2026-04-23

### 新增功能 - 核心功能增强
- **文件上传处理**：
  - 支持拖拽上传和点击上传
  - 支持 PDF、Word、Excel、图片、文本文件解析
  - 文件大小限制 10MB，最多 5 个文件
  - 自动解析文件内容并附加到消息发送给 AI
  - 新增组件：`FileUpload.vue`、`FilePreview.vue`
  - 新增服务：`fileParser.ts`（使用 pdfjs-dist、mammoth、xlsx）
  - 新增 composable：`useFileUpload.ts`
  - 集成到 `InputBox.vue` 和 `ChatMessage.vue`

- **代码高亮增强**：
  - 自动识别消息中的代码块（```language...```）
  - 支持 50+ 编程语言语法高亮（highlight.js）
  - 支持行号显示（多行代码显示，单行隐藏）
  - 支持代码一键复制
  - 修复代码块显示顺序问题：按原文顺序渲染
  - 新增 composable：`useCodeHighlight.ts`
  - 新增组件：`CodeBlock.vue`

- **对话导出**：
  - 支持导出为 Markdown 或 PDF 格式
  - 可选择包含/排除元数据（时间戳）
  - 可选择包含/排除系统消息
  - 文件自动命名：`chat-{title}-{timestamp}.md/pdf`
  - 新增组件：`ExportDialog.vue`
  - 新增 composable：`useExport.ts`（使用 jspdf、markdown-it）
  - 集成到 `ChatContainer.vue`

- **搜索功能**：
  - 支持实时搜索历史会话和消息内容
  - 搜索范围包括会话标题和消息内容
  - 高亮匹配关键词
  - 点击结果跳转到对应会话
  - 新增组件：`SearchPanel.vue`
  - 新增服务：`searchIndex.ts`
  - 新增 composable：`useSearch.ts`
  - 集成到 `Sidebar.vue`

### 类型扩展
- 扩展 `types/index.ts`：
  - 新增 `UploadedFile` 接口
  - 新增 `ExportOptions` 接口
  - 新增 `SearchResult` 接口
  - 扩展 `Message` 接口添加 `files` 字段

### 依赖更新
- 新增：`pdfjs-dist`、`mammoth`、`xlsx`、`jspdf`、`markdown-it`
- 新增 dev：`@types/jspdf`、`@types/markdown-it`

### 修复
- 修复 `tsconfig.app.json` 中 `baseUrl` 的 TypeScript 6.0 弃用警告
- 修复未使用变量导致的构建错误

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
# 开发记录

## 2026-04-23

### UI 改造 - 现代极简风格
- **整体配色系统**：
  - 暖白背景 `#faf9f7`，长时间使用不疲劳
  - 侧边栏 `#f5f4f2`，与主区形成微妙层次
  - 用户消息气泡柔和靛蓝 `#e8e4f9`
  - AI 消息纯白 `#ffffff` 带极细边框
  - 使用 CSS 变量统一管理，便于维护和扩展
  
- **侧边栏改造**：
  - 宽度从 240px 增加到 260px
  - 新建对话按钮：白色背景、细边框、圆角 8px
  - 搜索按钮：透明背景、悬停反馈
  - 会话项：内边距增加、激活状态带蓝色指示条
  - 删除按钮：悬停才显示，减少视觉噪音

- **消息气泡改造**：
  - 头像添加极细边框，更精致
  - 用户消息：柔和靛蓝背景、特殊圆角（指向效果）
  - AI 消息：纯白背景、极细边框、呼吸感更强
  - 操作按钮：悬停才显示，减少干扰
  - 时间戳：移到头像旁边，气泡框整体下移
  - 消息间距从 py-2 增加到 py-4

- **输入框改造**：
  - 改为悬浮卡片式设计，白色背景 + 阴影
  - 外层容器透明，与对话背景一致
  - 发送按钮：36x36px 圆角方形，状态变化更明显
  - 删除模式：卡片式确认框

- **代码块改造**：
  - 浅色主题 `#f8f9fa`，与整体风格统一
  - 头部 `#f0eeeb`，语言标签小写
  - 复制按钮：悬停反馈 + 成功状态

- **文件相关改造**：
  - 文件预览：横向滚动卡片式布局
  - 文件上传：更清晰的拖放区域，图标和文字颜色优化

- **设计文档**：
  - 新增设计规范：`docs/superpowers/specs/2026-04-23-ai-chat-ui-design.md`
  - 新增实施计划：`docs/superpowers/plans/2026-04-23-ai-chat-ui-plan.md`

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
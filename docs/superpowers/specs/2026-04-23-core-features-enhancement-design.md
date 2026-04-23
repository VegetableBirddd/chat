# 核心功能增强设计

## 1. 概述和架构

为AI Chat应用添加4个核心功能：文件上传处理、代码高亮、对话导出、搜索功能。这些功能将显著提升用户的生产力，使应用能够处理更复杂的任务场景。

**架构设计：**
- 采用模块化设计，每个功能独立封装为composable和组件
- 文件处理使用File API + 第三方库（pdf.js、mammoth、xlsx）
- 代码高亮使用highlight.js或shiki
- 导出功能使用jsPDF + markdown-it
- 搜索功能基于内存索引，支持实时搜索

**新增依赖：**
- `pdf.js` - PDF解析
- `mammoth` - Word文档解析
- `xlsx` - Excel解析
- `highlight.js` - 代码高亮
- `jsPDF` - PDF导出
- `markdown-it` - Markdown处理

**组件结构：**
```
src/
├── components/
│   ├── chat/
│   │   ├── FileUpload.vue          # 文件上传组件
│   │   ├── FilePreview.vue        # 文件预览组件
│   │   ├── CodeBlock.vue          # 代码块组件
│   │   ├── ExportDialog.vue       # 导出对话框
│   │   └── SearchPanel.vue        # 搜索面板
├── composables/
│   ├── useFileUpload.ts           # 文件上传逻辑
│   ├── useCodeHighlight.ts        # 代码高亮逻辑
│   ├── useExport.ts               # 导出逻辑
│   └── useSearch.ts               # 搜索逻辑
└── services/
    ├── fileParser.ts              # 文件解析服务
    └── searchIndex.ts             # 搜索索引服务
```

## 2. 数据模型

**新增类型定义：**

```typescript
// 文件相关
interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  content: string        // 解析后的文本内容
  preview?: string       // 图片预览URL
  uploadedAt: number
}

// 代码块相关
interface CodeBlock {
  language: string
  code: string
  lineNumbers?: boolean
}

// 导出相关
interface ExportOptions {
  format: 'markdown' | 'pdf'
  includeMetadata: boolean    // 是否包含时间戳等元数据
  includeSystemMessages: boolean
}

// 搜索相关
interface SearchResult {
  sessionId: string
  sessionTitle: string
  messageId: string
  content: string
  relevance: number
  timestamp: number
}
```

**扩展Message接口：**

```typescript
interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  error?: string
  files?: UploadedFile[]      // 新增：关联的文件
  codeBlocks?: CodeBlock[]    // 新增：代码块
}
```

## 3. 功能详细设计

### 3.1 文件上传/处理

**功能描述：**
- 支持拖拽上传和点击上传
- 支持文件类型：PDF、Word、Excel、图片（PNG、JPG、GIF）、纯文本
- 文件大小限制：单文件最大10MB
- 自动解析文件内容为文本，供AI理解

**交互流程：**
```
用户拖拽/选择文件 → 验证文件类型和大小 → 解析文件内容
→ 显示文件预览 → 用户确认 → 文件内容附加到消息 → 发送
```

**关键实现：**
- `FileUpload.vue`：上传区域，支持拖拽和点击
- `FilePreview.vue`：显示已上传文件列表，支持删除
- `useFileUpload.ts`：处理文件选择、验证、解析
- `fileParser.ts`：统一解析接口，根据文件类型调用不同解析器

**边界情况：**
- 文件过大：显示错误提示
- 不支持的文件类型：提示用户
- 解析失败：显示错误，允许用户重试或删除
- 多文件上传：支持批量上传，最多5个

### 3.2 代码高亮/格式化

**功能描述：**
- 自动识别消息中的代码块（```language ... ```）
- 支持50+编程语言高亮
- 支持行号显示
- 支持代码复制功能

**交互流程：**
```
AI返回消息 → 检测代码块 → 识别语言 → 应用高亮样式 → 渲染CodeBlock组件
```

**关键实现：**
- `CodeBlock.vue`：代码块组件，包含语言标签、复制按钮
- `useCodeHighlight.ts`：代码高亮逻辑，使用highlight.js
- 扩展`ChatMessage.vue`：检测和渲染代码块

**边界情况：**
- 无法识别的语言：使用纯文本显示
- 超长代码：限制高度，支持展开/收起
- 代码块嵌套：只处理最外层

### 3.3 导出对话

**功能描述：**
- 支持导出当前会话为Markdown或PDF
- 可选择是否包含系统消息
- 可选择是否包含元数据（时间戳）
- 导出文件自动命名：`chat-{title}-{timestamp}.md/pdf`

**交互流程：**
```
用户点击导出按钮 → 显示ExportDialog → 选择格式和选项
→ 生成文件 → 自动下载
```

**关键实现：**
- `ExportDialog.vue`：导出选项对话框
- `useExport.ts`：导出逻辑，支持Markdown和PDF格式
- Markdown导出：使用markdown-it格式化
- PDF导出：使用jsPDF + markdown-it

**边界情况：**
- 空会话：提示用户
- 导出失败：显示错误信息
- 大文件导出：显示进度条

### 3.4 搜索功能

**功能描述：**
- 支持搜索历史会话和消息内容
- 实时搜索（输入即搜索）
- 高亮匹配关键词
- 点击搜索结果跳转到对应消息

**交互流程：**
```
用户输入搜索词 → 实时搜索 → 显示结果列表
→ 点击结果 → 跳转到对应会话和消息
```

**关键实现：**
- `SearchPanel.vue`：搜索面板，显示搜索框和结果列表
- `useSearch.ts`：搜索逻辑，支持模糊匹配
- `searchIndex.ts`：构建内存索引，支持快速搜索
- 扩展`Sidebar.vue`：添加搜索按钮

**边界情况：**
- 无搜索结果：显示提示
- 搜索词为空：显示最近会话
- 搜索词过长：限制输入长度

## 4. 数据流

### 4.1 文件上传数据流

```
用户选择文件
  ↓
FileUpload.vue (handleFileSelect)
  ↓
useFileUpload.ts (validateFile)
  ↓
fileParser.ts (parseFile)
  ↓
生成 UploadedFile 对象
  ↓
chatStore.addMessage (附加 files 字段)
  ↓
发送到 API (files 内容作为上下文)
```

### 4.2 代码高亮数据流

```
AI 返回消息
  ↓
ChatMessage.vue (检测代码块)
  ↓
useCodeHighlight.ts (识别语言 + 高亮)
  ↓
CodeBlock.vue (渲染高亮代码)
  ↓
用户点击复制 → 复制到剪贴板
```

### 4.3 导出对话数据流

```
用户点击导出
  ↓
ExportDialog.vue (选择格式和选项)
  ↓
useExport.ts (根据选项生成内容)
  ↓
Markdown: markdown-it → .md 文件
PDF: jsPDF → .pdf 文件
  ↓
浏览器下载
```

### 4.4 搜索功能数据流

```
用户输入搜索词
  ↓
SearchPanel.vue (实时触发)
  ↓
useSearch.ts (searchIndex.search)
  ↓
返回 SearchResult[]
  ↓
渲染结果列表
  ↓
用户点击结果 → sessionStore.switchSession + 滚动到消息
```

## 5. 错误处理

**文件上传错误：**
- 文件过大：显示"文件大小超过10MB限制"
- 不支持的类型：显示"不支持的文件类型"
- 解析失败：显示"文件解析失败，请重试或删除"
- 网络错误：显示"上传失败，请检查网络连接"

**代码高亮错误：**
- 高亮库加载失败：降级为纯文本显示
- 语言识别失败：使用默认语言或纯文本

**导出错误：**
- 导出失败：显示"导出失败，请重试"
- 浏览器不支持：显示"您的浏览器不支持此功能"

**搜索错误：**
- 索引构建失败：显示"搜索功能暂时不可用"
- 搜索超时：显示"搜索超时，请重试"

**通用错误处理：**
- 所有错误都通过chatStore.error统一管理
- 错误消息显示在InputBox上方
- 错误状态3秒后自动清除

## 6. 测试策略

**单元测试：**
- `fileParser.ts`：测试各种文件类型的解析
- `useFileUpload.ts`：测试文件验证逻辑
- `useCodeHighlight.ts`：测试代码块检测和高亮
- `useExport.ts`：测试导出格式生成
- `useSearch.ts`：测试搜索逻辑

**集成测试：**
- 文件上传 → 发送消息 → AI响应
- 代码块检测 → 高亮渲染 → 复制功能
- 导出对话框 → 生成文件 → 下载
- 搜索输入 → 结果显示 → 跳转

**E2E测试：**
- 完整的文件上传流程
- 完整的导出流程
- 完整的搜索流程

## 7. 实现任务清单

**Phase 1: 文件上传（优先级：高）**
1. 安装依赖：pdf.js、mammoth、xlsx
2. 创建 `services/fileParser.ts`
3. 创建 `composables/useFileUpload.ts`
4. 创建 `components/chat/FileUpload.vue`
5. 创建 `components/chat/FilePreview.vue`
6. 扩展 `types/index.ts` 添加UploadedFile类型
7. 扩展 `Message` 接口添加files字段
8. 修改 `InputBox.vue` 集成文件上传
9. 修改 `ChatMessage.vue` 显示文件附件
10. 测试文件上传流程

**Phase 2: 代码高亮（优先级：高）**
1. 安装依赖：highlight.js
2. 创建 `composables/useCodeHighlight.ts`
3. 创建 `components/chat/CodeBlock.vue`
4. 扩展 `types/index.ts` 添加CodeBlock类型
5. 修改 `ChatMessage.vue` 检测和渲染代码块
6. 测试代码高亮功能

**Phase 3: 导出对话（优先级：中）**
1. 安装依赖：jsPDF、markdown-it
2. 创建 `composables/useExport.ts`
3. 创建 `components/chat/ExportDialog.vue`
4. 扩展 `types/index.ts` 添加ExportOptions类型
5. 修改 `ChatContainer.vue` 添加导出按钮
6. 测试导出功能

**Phase 4: 搜索功能（优先级：中）**
1. 创建 `services/searchIndex.ts`
2. 创建 `composables/useSearch.ts`
3. 创建 `components/chat/SearchPanel.vue`
4. 扩展 `types/index.ts` 添加SearchResult类型
5. 修改 `Sidebar.vue` 添加搜索按钮
6. 测试搜索功能

## 8. 验收标准

**文件上传：**
- [ ] 支持拖拽上传和点击上传
- [ ] 支持PDF、Word、Excel、图片、文本文件
- [ ] 文件大小限制10MB
- [ ] 自动解析文件内容
- [ ] 显示文件预览
- [ ] 支持删除已上传文件
- [ ] 文件内容附加到消息发送

**代码高亮：**
- [ ] 自动识别代码块
- [ ] 支持50+编程语言
- [ ] 代码正确高亮显示
- [ ] 支持代码复制
- [ ] 支持行号显示

**导出对话：**
- [ ] 支持导出为Markdown
- [ ] 支持导出为PDF
- [ ] 可选择包含/排除系统消息
- [ ] 可选择包含/排除元数据
- [ ] 文件自动命名
- [ ] 导出成功自动下载

**搜索功能：**
- [ ] 支持搜索会话标题
- [ ] 支持搜索消息内容
- [ ] 实时搜索
- [ ] 高亮匹配关键词
- [ ] 点击结果跳转到对应消息
- [ ] 无结果时显示提示

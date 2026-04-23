## Why

当前AI Chat应用仅支持基础文本对话，缺少文件上传、对话导出和搜索等核心生产力功能。用户无法上传文档供AI分析、无法保存重要对话、也无法快速查找历史消息。这些功能缺失严重限制了应用在实际工作场景中的可用性。

## What Changes

- **文件上传处理**：支持拖拽/点击上传PDF、Word、Excel、图片、文本文件，自动解析内容并附加到消息
- **代码高亮增强**：自动识别消息中的代码块，支持50+语言高亮、行号显示、一键复制
- **对话导出**：支持将当前会话导出为Markdown或PDF格式，可选包含元数据
- **搜索功能**：支持实时搜索历史会话和消息内容，高亮匹配关键词并跳转

## Capabilities

### New Capabilities
- `file-upload`: 文件上传、解析、预览和消息附加
- `code-highlight`: 代码块检测、语法高亮、行号、复制
- `conversation-export`: 对话导出为Markdown/PDF
- `search`: 历史会话和消息内容搜索

### Modified Capabilities
- （无现有spec需要修改）

## Impact

- **新增依赖**：pdf.js、mammoth、xlsx、jsPDF、markdown-it
- **新增组件**：FileUpload.vue、FilePreview.vue、ExportDialog.vue、SearchPanel.vue
- **新增服务**：fileParser.ts、searchIndex.ts
- **新增composables**：useFileUpload.ts、useExport.ts、useSearch.ts
- **修改组件**：InputBox.vue（集成文件上传）、ChatMessage.vue（显示附件）、ChatContainer.vue（添加导出按钮）、Sidebar.vue（添加搜索按钮）
- **类型扩展**：UploadedFile、ExportOptions、SearchResult等类型

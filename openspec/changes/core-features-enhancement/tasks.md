## 1. 类型扩展和依赖安装

- [x] 1.1 扩展 types/index.ts：添加 UploadedFile、ExportOptions、SearchResult 接口，扩展 Message 接口添加 files 字段
- [x] 1.2 安装文件解析依赖：npm install pdfjs-dist mammoth xlsx
- [x] 1.3 安装导出依赖：npm install jspdf markdown-it
- [x] 1.4 安装类型定义：npm install -D @types/jspdf @types/markdown-it

## 2. 代码高亮完善（已部分实现）

- [x] 2.1 完善 useCodeHighlight.ts：确保行号逻辑正确、复制功能正常
- [x] 2.2 完善 CodeBlock.vue：确保语言标签、复制按钮、行号显示正常
- [x] 2.3 验证 ChatMessage.vue 中代码块按原文顺序渲染

## 3. 文件上传功能

- [x] 3.1 创建 services/fileParser.ts：实现 PDF/Word/Excel/文本/图片解析
- [x] 3.2 创建 composables/useFileUpload.ts：文件选择、验证、解析逻辑
- [x] 3.3 创建 components/chat/FileUpload.vue：拖拽/点击上传UI
- [x] 3.4 创建 components/chat/FilePreview.vue：文件列表和删除UI
- [x] 3.5 修改 InputBox.vue：集成文件上传和预览
- [x] 3.6 修改 ChatMessage.vue：显示文件附件
- [x] 3.7 修改 ChatContainer.vue：发送消息时附加文件内容

## 4. 对话导出功能

- [x] 4.1 创建 composables/useExport.ts：Markdown/PDF 导出逻辑
- [x] 4.2 创建 components/chat/ExportDialog.vue：导出选项对话框
- [x] 4.3 修改 ChatContainer.vue：添加导出按钮，集成 ExportDialog

## 5. 搜索功能

- [x] 5.1 创建 services/searchIndex.ts：内存搜索索引构建
- [x] 5.2 创建 composables/useSearch.ts：搜索逻辑
- [x] 5.3 创建 components/chat/SearchPanel.vue：搜索面板UI
- [x] 5.4 修改 Sidebar.vue：添加搜索按钮，集成 SearchPanel

## 6. 集成测试和验证

- [x] 6.1 运行 npm run typecheck 确保无类型错误
- [x] 6.2 运行 npm run build 确保构建成功
- [x] 6.3 验证各功能端到端流程

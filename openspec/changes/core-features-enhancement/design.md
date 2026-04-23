## Context

当前AI Chat是一个基于Vue 3 + Vite的SPA应用，使用DeepSeek API进行流式对话。应用已有基础对话功能（消息发送/接收、会话管理、本地存储），但缺少文件处理、导出和搜索能力。

现有架构：
- **状态管理**：Pinia（chat.ts、session.ts）
- **API服务**：services/api.ts（Fetch API流式请求）
- **组件**：ChatContainer、MessageList、ChatMessage、InputBox、Sidebar
- **类型**：Message、CodeBlock、ChatRequest等

## Goals / Non-Goals

**Goals:**
- 实现文件上传、解析、预览和消息附加
- 实现代码块自动检测、语法高亮、行号、复制
- 实现对话导出为Markdown/PDF
- 实现历史会话和消息搜索

**Non-Goals:**
- 不支持文件云端存储（仅本地解析后发送）
- 不支持代码执行或沙箱
- 不支持多语言搜索（仅中文和英文）
- 不替换现有UI框架（继续使用Tailwind CSS）

## Decisions

### 1. 文件解析方案
- **选择**：使用原生File API + 第三方库（pdf.js、mammoth、xlsx）
- **理由**：需要在浏览器端解析文件，不依赖后端服务
- **替代方案**：上传到后端解析（需要服务器，增加复杂度）

### 2. 代码高亮库
- **选择**：highlight.js（已安装）
- **理由**：轻量、支持50+语言、已有集成基础
- **替代方案**：Shiki（体积大，需要wasm，不适合浏览器）

### 3. 导出方案
- **选择**：Markdown用原生Blob下载，PDF用jsPDF
- **理由**：Markdown导出简单直接；PDF需要客户端生成，jsPDF成熟稳定
- **替代方案**：后端生成PDF（需要服务器）

### 4. 搜索方案
- **选择**：内存索引 + 简单字符串匹配
- **理由**：数据量小（localStorage），不需要复杂搜索引擎
- **替代方案**：fuse.js（增加依赖，收益不大）

### 5. 组件通信
- **选择**：继续使用Pinia store + props/emit
- **理由**：保持与现有架构一致，避免引入新状态管理方案

## Risks / Trade-offs

- **[Risk]** 大文件解析阻塞UI → **[Mitigation]** 使用Web Worker或异步解析，添加加载状态
- **[Risk]** PDF.js体积大 → **[Mitigation]** 按需加载，仅在使用时导入
- **[Risk]** jsPDF中文支持有限 → **[Mitigation]** Markdown导出优先，PDF导出作为辅助功能
- **[Risk]** 搜索性能随消息量增长下降 → **[Mitigation]** 限制搜索范围（当前会话或最近50条消息）

## Migration Plan

无需数据迁移。新功能为增量添加，不影响现有对话数据。

## Open Questions

1. 文件上传后，文件内容如何与消息一起发送到API？（方案：将解析后的文本附加到消息content中）
2. 搜索功能是否需要索引持久化？（方案：每次启动时从localStorage重建索引）

## Why

当前聊天界面缺少对单条消息的操作能力，用户无法对已发送的消息进行编辑、复制或删除，影响使用体验和效率。

## What Changes

- 在用户消息气泡上添加hover操作按钮（删除、编辑、复制）
- 编辑功能：点击编辑按钮后，气泡变为inline可编辑状态
- 复制功能：点击复制按钮直接复制用户原始文本到剪贴板
- 删除功能：支持多选模式，可在会话内选择多条消息批量删除

## Capabilities

### New Capabilities

- `message-actions`: 用户消息气泡的 hover 操作按钮（删除、编辑、复制）
- `inline-edit`: 消息气泡的 inline 直接编辑功能
- `multi-delete`: 多选删除模式，支持会话内批量删除消息

### Modified Capabilities

- 无

## Impact

- 修改 `ChatMessage.vue` 组件添加操作按钮
- 修改 `ChatStore` 添加编辑状态管理
- 修改 `InputBox.vue` 集成多选删除确认栏
- 新增操作按钮图标组件
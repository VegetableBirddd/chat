## Why

当大模型 API 请求发送失败时，用户无法直观地看到该消息发送失败，也无法方便地重新发送。这影响了用户体验，尤其是网络不稳定的情况下。

## What Changes

- 在发送失败的用户消息气泡框左侧添加重新发送按钮
- 点击重新发送按钮后，自动重新发送该消息
- 重新发送时显示加载状态
- 成功后移除失败状态标记

## Capabilities

### New Capabilities
- `resend-failed-message`: 支持重新发送失败消息的功能，包括失败状态显示和重新发送触发

### Modified Capabilities
- 无

## Impact

- 聊天消息组件 (`ChatMessage.vue`)
- 聊天输入框组件 (`InputBox.vue` via store interaction)
- 聊天状态管理 (`chat.ts` store)
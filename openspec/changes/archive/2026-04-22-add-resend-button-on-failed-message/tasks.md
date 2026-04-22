## 1. 数据类型定义

- [x] 1.1 在 `src/types/index.ts` 中扩展 Message 类型，添加 `error?: string` 字段

## 2. Chat Store 更新

- [x] 2.1 在 `src/stores/chat.ts` 中添加 `resendMessage` 方法
- [x] 2.2 修改 `sendMessage` 方法，在请求失败时保存错误信息到消息对象

## 3. UI 组件更新

- [x] 3.1 更新 `src/components/chat/ChatMessage.vue`，为失败的用户消息添加重新发送按钮
- [x] 3.2 添加重新发送 SVG 图标
- [x] 3.3 实现点击重新发送按钮调用 store 的 `resendMessage` 方法
- [x] 3.4 添加加载状态的视觉反馈

## 4. 测试与验证

- [x] 4.1 运行 `npm run typecheck` 确保类型检查通过
- [x] 4.2 手动测试：触发消息发送失败后点击重新发送按钮
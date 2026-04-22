## Why

当前左边历史对话列表按创建时间倒序排列（新建对话在最上面），用户希望改变为正序排列（新建对话在最下面），更符合常见的聊天应用习惯。

## What Changes

- 修改 `session.ts` 中的 `createSession` 函数，新建对话时添加到数组末尾而非开头
- 修改 `loadFromStorage` 函数加载后设置最新会话为 `currentSessionId`

## Capabilities

### New Capabilities
- 无新功能

### Modified Capabilities
- `chat-history-order`: 将历史对话列表从倒序改为正序排列

## Impact

- 仅涉及 `app/src/stores/session.ts` 的修改
- 无 API 或外部依赖变更
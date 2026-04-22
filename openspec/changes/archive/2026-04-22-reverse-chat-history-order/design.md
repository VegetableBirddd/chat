## Context

当前历史对话列表使用 `unshift` 将新对话添加到数组开头，导致新建对话显示在最上面。用户希望新对话显示在最下面，更符合微信等常见聊天应用的习惯。

## Goals / Non-Goals

**Goals:**
- 将新建对话的显示顺序从最上面改为最下面
- 保持现有数据存储结构不变

**Non-Goals:**
- 不修改数据持久化格式
- 不添加新功能

## Decisions

**Decision 1: 使用 push 代替 unshift**
- 将 `sessions.value.unshift({...})` 改为 `sessions.value.push({...})`
- 这样新建对话会添加到数组末尾，显示在最下面

**Decision 2: 修改 currentSessionId 指向**
- `loadFromStorage()` 时将 `currentSessionId` 设为最后一个会话（最新会话）
- 这样用户打开应用时进入最近创建的对话

**Decision 3: 修改滚动行为**
- `Sidebar.vue` 中 `handleCreate()` 创建后滚动到列表底部而非顶部
- 使用 `scrollTop = listRef.value.scrollHeight` 实现

## Risks / Trade-offs

- 无重大风险，这是一个简单的显示顺序调整
- 现有用户的会话数据会自动按新顺序显示（按createdAt排序不变，仅改变添加位置）
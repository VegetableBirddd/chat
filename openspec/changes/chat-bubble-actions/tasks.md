## 1. ChatStore 状态扩展

- [x] 1.1 添加 `editingMessageId` 状态（string | null），记录正在编辑的消息 id
- [x] 1.2 添加 `isDeleting` 状态（boolean），标识是否处于多选删除模式
- [x] 1.3 添加 `selectedMessageIds` 状态（string[]），记录多选模式下选中的消息 id 列表
- [x] 1.4 添加 `updateMessageContent(id, content)` 方法，更新指定消息内容
- [x] 1.5 添加 `deleteMessages(ids)` 方法，批量删除指定 id 的消息
- [x] 1.6 添加 `enterDeleteMode()` / `exitDeleteMode()` 方法
- [x] 1.7 添加 `toggleMessageSelection(id)` / `clearSelection()` 方法
- [x] 1.8 添加 `setEditingMessageId(id | null)` 方法

## 2. ChatMessage 组件改造

- [x] 2.1 添加 hover 操作按钮组（删除、编辑、复制），仅对 role='user' 的消息显示
- [x] 2.2 实现复制功能：使用 Clipboard API 复制消息内容，显示"已复制"反馈
- [x] 2.3 实现编辑模式：点击编辑按钮后消息内容变为可编辑 textarea，显示保存/取消按钮
- [x] 2.4 编辑模式下按 Enter 保存（Ctrl+Enter 或点击保存按钮），按 ESC 取消
- [x] 2.5 多选模式下在消息左侧显示勾选框
- [x] 2.6 使用纯图标按钮 + hover tooltip 样式（删除🗑️/编辑✏️/复制📋 或 SVG 图标）

## 3. InputBox 组件改造（删除确认栏）

- [x] 3.1 读取 ChatStore.isDeleting 状态，多选模式时输入框区域变为删除确认栏
- [x] 3.2 删除确认栏显示"已选择 X 条消息"和"确认删除"按钮
- [x] 3.3 未选择消息时"确认删除"按钮禁用
- [x] 3.4 添加"取消"按钮退出多选模式
- [x] 3.5 确认删除后调用 ChatStore.deleteMessages() 并退出多选模式

## 4. ChatContainer 集成

- [x] 4.1 将 ChatStore 的编辑/删除状态传递给 MessageList 和 InputBox
- [x] 4.2 确保删除消息后同步更新 sessionStore

## 5. 样式与交互优化

- [x] 5.1 操作按钮组显示/隐藏动画（淡入淡出）
- [x] 5.2 编辑模式下 textarea 样式适配（与气泡风格一致）
- [x] 5.3 多选模式下消息列表样式调整（支持勾选框）
- [x] 5.4 复制成功 toast 反馈样式
## ADDED Requirements

### Requirement: 进入编辑模式
用户点击编辑按钮后，消息气泡进入 inline 可编辑状态。

#### Scenario: 点击编辑按钮
- **WHEN** 用户点击编辑按钮
- **THEN** 消息气泡内的文本变为可编辑状态（如 textarea 或 contenteditable）
- **THEN** 操作按钮变为保存/取消按钮

### Requirement: 保存编辑
用户完成编辑后可以保存修改，更新消息内容。

#### Scenario: 保存编辑内容
- **WHEN** 用户点击保存按钮
- **THEN** 更新该条消息的 content 为编辑后的文本
- **THEN** 消息退出编辑状态，恢复为普通显示模式

#### Scenario: 保存后更新 Store
- **WHEN** 用户保存编辑
- **THEN** ChatStore 中对应 message 的 content 更新为新文本

### Requirement: 取消编辑
用户可以在编辑过程中取消修改，恢复到原始内容。

#### Scenario: 取消编辑
- **WHEN** 用户点击取消按钮
- **THEN** 消息退出编辑状态
- **THEN** 消息内容恢复为编辑前的原始文本
- **THEN** 操作按钮恢复为删除/编辑/复制

### Requirement: 编辑状态管理
编辑状态由 ChatStore 统一管理，支持跨组件访问。

#### Scenario: Store 编辑状态
- **WHEN** 任何消息进入编辑模式
- **THEN** Store 记录当前正在编辑的消息 id
- **THEN** 其他组件可读取编辑状态
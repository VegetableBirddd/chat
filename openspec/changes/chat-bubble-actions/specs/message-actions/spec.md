## ADDED Requirements

### Requirement: Hover 显示操作按钮
当用户鼠标 hover 到用户角色的消息气泡上时，气泡底部显示操作按钮组。

#### Scenario: Hover 用户消息显示按钮
- **WHEN** 用户鼠标 hover 到 role 为 user 的消息气泡
- **THEN** 气泡底部显示三个操作按钮（删除、编辑、复制）

#### Scenario: Hover AI 消息不显示按钮
- **WHEN** 用户鼠标 hover 到 role 为 assistant 的消息气泡
- **THEN** 不显示任何操作按钮

#### Scenario: 离开 hover 隐藏按钮
- **WHEN** 用户鼠标离开消息气泡
- **THEN** 操作按钮隐藏

### Requirement: 按钮样式
操作按钮使用纯图标样式，hover 时显示中文 tooltip 提示。

#### Scenario: 删除按钮样式
- **WHEN** 用户 hover 到删除按钮图标
- **THEN** 显示 tooltip "删除"

#### Scenario: 编辑按钮样式
- **WHEN** 用户 hover 到编辑按钮图标
- **THEN** 显示 tooltip "编辑"

#### Scenario: 复制按钮样式
- **WHEN** 用户 hover 到复制按钮图标
- **THEN** 显示 tooltip "复制"

### Requirement: 复制功能
点击复制按钮将用户消息的纯文本内容复制到系统剪贴板。

#### Scenario: 复制消息内容
- **WHEN** 用户点击复制按钮
- **THEN** 该条消息的 content 文本被复制到剪贴板
- **THEN** 显示复制成功反馈（如 tooltip 短暂变为 "已复制"）

### Requirement: 只对用户消息生效
所有操作按钮仅针对 role 为 user 的消息气泡显示。

#### Scenario: 非用户消息无操作
- **WHEN** message.role 不为 'user'
- **THEN** 即使 hover 也不显示操作按钮
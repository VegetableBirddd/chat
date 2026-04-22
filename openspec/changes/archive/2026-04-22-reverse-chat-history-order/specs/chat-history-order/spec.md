## ADDED Requirements

### Requirement: 对话列表正序显示
新建的对话 SHALL 显示在列表最下方（最后一个位置）。

#### Scenario: 创建新对话
- **WHEN** 用户点击"新建对话"按钮
- **THEN** 新对话显示在列表最下面

### Requirement: 最新对话高亮
应用启动时 SHALL 自动进入最近创建的对话。

#### Scenario: 加载对话列表
- **WHEN** 用户打开应用并加载历史对话
- **THEN** 当前会话自动切换到最近创建的对话

### Requirement: 滚动到最新对话
创建新对话后 SHALL 自动滚动到对话列表底部。

#### Scenario: 创建后滚动
- **WHEN** 用户创建新对话后
- **THEN** 列表自动滚动到最下方显示新对话
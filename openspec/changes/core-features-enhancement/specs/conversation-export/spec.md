## ADDED Requirements

### Requirement: Export format selection
The system SHALL allow users to choose export format (Markdown or PDF).

#### Scenario: Select Markdown export
- **WHEN** user chooses Markdown format
- **THEN** system generates a .md file

#### Scenario: Select PDF export
- **WHEN** user chooses PDF format
- **THEN** system generates a .pdf file

### Requirement: Export options
The system SHALL provide options for including metadata and system messages.

#### Scenario: Include metadata
- **WHEN** user enables "包含元数据" option
- **THEN** exported file includes timestamps and session info

#### Scenario: Exclude system messages
- **WHEN** user disables "包含系统消息" option
- **THEN** system messages are excluded from export

### Requirement: File naming
The system SHALL auto-name exported files with session title and timestamp.

#### Scenario: Auto-named export
- **WHEN** user exports a session titled "项目讨论"
- **THEN** file is named "chat-项目讨论-20260423-143052.md"

### Requirement: Export trigger
The system SHALL provide an export button in the chat interface.

#### Scenario: Click export button
- **WHEN** user clicks export button
- **THEN** export dialog opens with format and option selections

#### Scenario: Empty session export
- **WHEN** user tries to export an empty session
- **THEN** system displays "当前会话为空" warning

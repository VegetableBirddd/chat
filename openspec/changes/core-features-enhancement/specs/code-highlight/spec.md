## ADDED Requirements

### Requirement: Code block detection
The system SHALL automatically detect code blocks in messages using markdown syntax (```language...```).

#### Scenario: Detect code block with language
- **WHEN** message contains ```python\ndef hello():\n    pass\n```
- **THEN** system detects a Python code block

#### Scenario: Detect code block without language
- **WHEN** message contains ```\nsome code\n```
- **THEN** system detects a code block with language "plaintext"

### Requirement: Syntax highlighting
The system SHALL apply syntax highlighting to detected code blocks.

#### Scenario: Highlight Python code
- **WHEN** a Python code block is detected
- **THEN** system applies Python syntax highlighting

#### Scenario: Unknown language fallback
- **WHEN** a code block has an unrecognized language
- **THEN** system displays the code as plain text

### Requirement: Code block UI
The system SHALL render code blocks with language label and copy button.

#### Scenario: Display code block
- **WHEN** a code block is rendered
- **THEN** it shows language label, line count, and copy button

#### Scenario: Copy code
- **WHEN** user clicks the copy button
- **THEN** the code content is copied to clipboard

### Requirement: Line numbers
The system SHALL support optional line numbers for code blocks.

#### Scenario: Show line numbers
- **WHEN** a code block has more than one line
- **THEN** line numbers are displayed

#### Scenario: Single line no numbers
- **WHEN** a code block has only one line
- **THEN** line numbers are hidden

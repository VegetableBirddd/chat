## ADDED Requirements

### Requirement: File upload UI
The system SHALL provide a file upload interface supporting drag-and-drop and click-to-upload.

#### Scenario: Drag and drop file
- **WHEN** user drags a file into the upload area
- **THEN** the file is selected for upload

#### Scenario: Click to upload
- **WHEN** user clicks the upload area and selects a file
- **THEN** the file is selected for upload

### Requirement: File validation
The system SHALL validate uploaded files for type and size before processing.

#### Scenario: Valid file upload
- **WHEN** user uploads a PDF file under 10MB
- **THEN** the file passes validation and proceeds to parsing

#### Scenario: File too large
- **WHEN** user uploads a file larger than 10MB
- **THEN** system displays "文件大小超过10MB限制" error

#### Scenario: Unsupported file type
- **WHEN** user uploads an unsupported file type
- **THEN** system displays "不支持的文件类型" error

### Requirement: File parsing
The system SHALL parse supported files into text content for AI understanding.

#### Scenario: Parse PDF file
- **WHEN** user uploads a PDF file
- **THEN** system extracts text content from the PDF

#### Scenario: Parse Word document
- **WHEN** user uploads a Word document
- **THEN** system extracts text content from the document

#### Scenario: Parse Excel file
- **WHEN** user uploads an Excel file
- **THEN** system extracts text content from the spreadsheet

#### Scenario: Parse text file
- **WHEN** user uploads a text file
- **THEN** system reads the file content as text

#### Scenario: Parse image file
- **WHEN** user uploads an image file
- **THEN** system stores the image for display (no text extraction)

### Requirement: File preview
The system SHALL display uploaded files with preview and delete capability.

#### Scenario: Display file list
- **WHEN** files are uploaded
- **THEN** system displays file names, types, and sizes

#### Scenario: Delete uploaded file
- **WHEN** user clicks delete on a file
- **THEN** the file is removed from the upload list

### Requirement: File attachment to message
The system SHALL attach parsed file content to the message sent to AI.

#### Scenario: Send message with files
- **WHEN** user sends a message with attached files
- **THEN** the message includes file content as context for AI

#### Scenario: Multiple file upload
- **WHEN** user uploads up to 5 files
- **THEN** all files are parsed and attached to the message

## ADDED Requirements

### Requirement: Search interface
The system SHALL provide a search input for searching history.

#### Scenario: Open search panel
- **WHEN** user clicks search button in sidebar
- **THEN** search panel opens with search input

#### Scenario: Real-time search
- **WHEN** user types in search input
- **THEN** results update in real-time as user types

### Requirement: Search scope
The system SHALL search across session titles and message content.

#### Scenario: Search session titles
- **WHEN** user searches for "项目"
- **THEN** sessions with "项目" in title are returned

#### Scenario: Search message content
- **WHEN** user searches for "function"
- **THEN** messages containing "function" are returned

### Requirement: Search results
The system SHALL display search results with context and relevance.

#### Scenario: Display results
- **WHEN** search returns results
- **THEN** each result shows session title, message preview, and timestamp

#### Scenario: Highlight matches
- **WHEN** search results are displayed
- **THEN** matching keywords are highlighted

### Requirement: Result navigation
The system SHALL allow jumping to search results.

#### Scenario: Click result
- **WHEN** user clicks a search result
- **THEN** system switches to that session and scrolls to the message

#### Scenario: No results
- **WHEN** search returns no results
- **THEN** system displays "未找到相关结果" message

# AGENTS.md - Development Guidelines for AI Chat Application

## Project Overview

- **Project Type**: Vue 3 + Vite SPA (AI Chatbot with Streaming)
- **Target**: Browser-based chat interface similar to Doubao
- **AI Backend**: External API (OpenAI/Claude/DeepSeek compatible)

---

## Commands

### Development
```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build to dist/
npm run preview     # Preview production build
```

### Linting & Formatting
```bash
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues
npm run format      # Format with Prettier
```

### Testing
```bash
npm run test              # Run all tests (watch mode)
npm run test:run         # Run tests once
npm run test:coverage     # Run with coverage report
npm run test <file>       # Run single test file
npm run test -- --grep "pattern"  # Run tests matching pattern
```

### Type Checking
```bash
npm run typecheck    # Run Vue TypeScript checking
```

---

## Code Style Guidelines

### General Principles
- Use **Composition API** (`<script setup>`) with TypeScript
- Prefer functional components and composables
- Keep components small and focused (single responsibility)
- Use semantic HTML and accessible patterns

### File Structure
```
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Reusable Vue components
│   ├── common/      # Buttons, inputs, modals
│   └── chat/        # Chat-specific components
├── composables/     # Vue composables (useXxx)
├── views/           # Page-level components
├── stores/          # Pinia stores
├── services/        # API services
├── types/           # TypeScript interfaces
├── utils/           # Helper functions
└── App.vue
```

### Naming Conventions
| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `ChatMessage.vue`, `InputBox.vue` |
| Composables | camelCase with "use" prefix | `useChat.ts`, `useStream.ts` |
| Stores | camelCase with store name | `useChatStore.ts` |
| Types/Interfaces | PascalCase | `Message`, `ChatRequest` |
| Constants | UPPER_SNAKE_CASE | `MAX_TOKEN_LIMIT` |
| CSS Classes | kebab-case | `.chat-container` |

### TypeScript Guidelines
```typescript
// Use interfaces for objects, type for unions/aliases
interface Message { id: string; role: 'user' | 'assistant'; content: string; timestamp: number; }
type Role = 'user' | 'assistant' | 'system';

// Avoid 'any', use 'unknown' when uncertain
function parseResponse(data: unknown): Message { if (!isMessage(data)) throw new Error('Invalid'); return data; }
```

### Import Order
1. Vue core imports (`vue`)
2. External libraries (`@vueuse`, `axios`)
3. Internal absolute imports (`@/`, `#/` aliases)
4. Relative imports (`.`, `..`)
5. Type imports (`import type`)

### Vue Component Style
```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Message } from '@/types'

const props = defineProps<{ messages: Message[]; isLoading?: boolean }>()
const emit = defineEmits<{ (e: 'send', content: string): void; (e: 'clear'): void }>()

const inputValue = ref('')
const canSend = computed(() => inputValue.value.trim().length > 0)

function handleSend() {
  if (!canSend.value) return
  emit('send', inputValue.value)
  inputValue.value = ''
}
</script>

<template>
  <div class="chat-container">
    <MessageList :messages="messages" />
    <InputBox v-model="inputValue" @send="handleSend" />
  </div>
</template>
```

### Error Handling
```typescript
async function sendMessage(content: string): Promise<void> {
  try {
    const response = await chatApi.send(content)
    messages.value.push(response)
  } catch (error) {
    if (error instanceof ApiError) { showNotification(error.message, 'error'); }
    else { showNotification('Network error', 'error'); }
  }
}

class ApiError extends Error {
  constructor(message: string, public code: string, public status: number) { super(message); this.name = 'ApiError'; }
}
```

### Streaming Response Handling
```typescript
async function* streamChat(prompt: string) {
  const response = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ prompt }) })
  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response stream')
  const decoder = new TextDecoder()
  while (true) { const { done, value } = await reader.read(); if (done) break; yield decoder.decode(value); }
}
```

### CSS/Tailwind Guidelines
- Use **Tailwind CSS** for styling
- Custom styles in `<style scoped>` when needed
- Use semantic class names: `.chat-header`, `.message-bubble`
- Support dark mode via `dark:` modifier

---

## Testing Guidelines
- Unit tests: `*.test.ts` next to source file
- Component tests: `*.component.test.ts` or `components/__tests__/`

---

## Git Conventions
- Branch: `feature/xxx`, `fix/xxx`, `refactor/xxx`
- Commits: `feat:`, `fix:`, `refactor:`, `docs:`
- Run `npm run lint` and `npm run typecheck` before committing
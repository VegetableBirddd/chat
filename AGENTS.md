# AGENTS.md - Development Guidelines for AI Chat Application

## Project Overview

- **Project Type**: Vue 3 + Vite SPA (AI Chatbot with Streaming)
- **Target**: Browser-based chat interface similar to Doubao
- **AI Backend**: DeepSeek API (configurable)

---

## Commands

### Development
```bash
cd app
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Production build to dist/
npm run preview          # Preview production build
```

### Code Quality
```bash
npm run typecheck        # Run TypeScript checking
```

---

## File Structure
```
app/
├── src/
│   ├── components/chat/   # Chat components
│   │   ├── ChatContainer.vue   # Main container
│   │   ├── ChatMessage.vue    # Message bubble
│   │   ├── MessageList.vue   # Message list
│   │   └── InputBox.vue      # Input box
│   ├── stores/           # Pinia stores
│   │   └── chat.ts       # Chat store
│   ├── services/        # API services
│   │   └── api.ts       # DeepSeek API
│   ├── types/           # TypeScript types
│   │   └── index.ts    # Type definitions
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── .env.example        # Environment template
├── vite.config.ts
└── tsconfig.app.json
```

---

## Code Style

### Components (Composition API)
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Message } from '@/types'

const props = defineProps<{
  messages: Message[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'send', content: string): void
}>()

const inputValue = ref('')
const canSend = computed(() => inputValue.value.trim().length > 0)

function handleSend() {
  if (!canSend.value) return
  emit('send', inputValue.value)
  inputValue.value = ''
}
</script>

<template>
  <div>{{ message.content }}</div>
</template>
```

### API Service (Streaming)
```typescript
// Use Fetch API for streaming, not axios
const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(request)
})

const reader = response.body?.getReader()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  // Process chunk
}
```

### Naming Conventions
| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `ChatMessage.vue` |
| Composables | camelCase | `useChat.ts` |
| Stores | camelCase | `useChatStore.ts` |
| Types | PascalCase | `Message`, `ChatRequest` |
| CSS Classes | kebab-case | `.chat-container` |

### TypeScript Guidelines
```typescript
// Use interfaces for objects
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// Use type for unions
type MessageRole = 'user' | 'assistant' | 'system'

// Avoid 'any', use 'unknown'
function parseResponse(data: unknown): Message {
  if (!isMessage(data)) throw new Error('Invalid')
  return data
}
```

---

## Environment Variables

Create `.env` from `.env.example`:
```bash
cp .env.example .env
```

Required:
- `VITE_DEEPSEEK_API_KEY` - DeepSeek API Key
- `VITE_DEEPSEEK_BASE_URL` - API Base URL (default: https://api.deepseek.com)
- `VITE_DEEPSEEK_MODEL` - Model name (default: deepseek-chat)

---

## Git Conventions

- Branch: `feature/xxx`, `fix/xxx`
- Commits: `feat:`, `fix:`, `chore:`, `docs:`
- Run `npm run typecheck` before committing

---

## Development Log

See `CHANGELOG.md` for project history.
# Code Highlighting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add code highlighting functionality to AI Chat application with syntax highlighting, copy buttons, and line numbers

**Architecture:** Use highlight.js for syntax highlighting, create CodeBlock component for rendering, extend Message interface to support code blocks

**Tech Stack:** Vue 3, TypeScript, highlight.js, Pinia

---

### Task 1: Install Dependencies and Update Types

**Files:**
- Modify: `app/package.json`
- Modify: `app/src/types/index.ts`

- [ ] **Step 1: Install highlight.js dependencies**

```bash
cd app
npm install highlight.js @types/highlight.js
```

- [ ] **Step 2: Add CodeBlock type definition**

```typescript
// In app/src/types/index.ts, add after Message interface
export interface CodeBlock {
  language: string
  code: string
  lineNumbers?: boolean
}

// Update Message interface to include codeBlocks
export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  error?: string
  codeBlocks?: CodeBlock[]    // Add this line
}
```

- [ ] **Step 3: Verify TypeScript compilation**

```bash
cd app
npm run typecheck
```
Expected: No type errors

- [ ] **Step 4: Commit**

```bash
git add app/package.json app/package-lock.json app/src/types/index.ts
git commit -m "feat: add highlight.js dependency and CodeBlock type"
```

### Task 2: Create Code Highlighting Composable

**Files:**
- Create: `app/src/composables/useCodeHighlight.ts`

- [ ] **Step 1: Create composable file structure**

```typescript
// app/src/composables/useCodeHighlight.ts
import { ref, onMounted } from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import type { CodeBlock } from '@/types'

export function useCodeHighlight() {
  const isLoaded = ref(false)

  onMounted(() => {
    isLoaded.value = true
  })

  function detectCodeBlocks(content: string): CodeBlock[] {
    const codeBlocks: CodeBlock[] = []
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    let match
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || 'plaintext'
      const code = match[2].trim()
      codeBlocks.push({
        language,
        code,
        lineNumbers: true
      })
    }
    
    return codeBlocks
  }

  function highlightCode(code: string, language: string): string {
    if (!isLoaded.value || !hljs.getLanguage(language)) {
      return code
    }
    
    try {
      return hljs.highlight(code, { language }).value
    } catch {
      return code
    }
  }

  function extractTextWithoutCodeBlocks(content: string): string {
    return content.replace(/```(\w+)?\n([\s\S]*?)```/g, '')
  }

  function copyToClipboard(text: string): Promise<void> {
    return navigator.clipboard.writeText(text)
  }

  return {
    isLoaded,
    detectCodeBlocks,
    highlightCode,
    extractTextWithoutCodeBlocks,
    copyToClipboard
  }
}
```

- [ ] **Step 2: Test the composable**

```bash
cd app
npm run typecheck
```
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add app/src/composables/useCodeHighlight.ts
git commit -m "feat: create useCodeHighlight composable"
```

### Task 3: Create CodeBlock Component

**Files:**
- Create: `app/src/components/chat/CodeBlock.vue`

- [ ] **Step 1: Create CodeBlock component**

```vue
<!-- app/src/components/chat/CodeBlock.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCodeHighlight } from '@/composables/useCodeHighlight'
import type { CodeBlock } from '@/types'

const props = defineProps<{
  codeBlock: CodeBlock
}>()

const { highlightCode, copyToClipboard } = useCodeHighlight()
const isCopied = ref(false)
const highlightedCode = ref('')

const lineCount = computed(() => {
  return props.codeBlock.code.split('\n').length
})

const showLineNumbers = computed(() => {
  return props.codeBlock.lineNumbers !== false && lineCount.value > 1
})

onMounted(() => {
  highlightedCode.value = highlightCode(props.codeBlock.code, props.codeBlock.language)
})

async function handleCopy() {
  try {
    await copyToClipboard(props.codeBlock.code)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<template>
  <div class="code-block rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden">
    <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono text-gray-600 dark:text-gray-400">
          {{ codeBlock.language }}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-500">
          {{ lineCount }} lines
        </span>
      </div>
      <button
        @click="handleCopy"
        class="flex items-center gap-1 px-3 py-1 text-xs rounded-md transition-colors"
        :class="isCopied 
          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'"
      >
        <svg v-if="isCopied" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
        {{ isCopied ? 'Copied!' : 'Copy' }}
      </button>
    </div>
    <div class="relative overflow-auto">
      <div class="flex">
        <div v-if="showLineNumbers" class="line-numbers select-none text-right py-2 px-3 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs font-mono">
          <div v-for="n in lineCount" :key="n" class="leading-6">
            {{ n }}
          </div>
        </div>
        <pre class="flex-1 py-2 px-4 m-0 overflow-auto"><code class="hljs" v-html="highlightedCode"></code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-block {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}

.line-numbers {
  min-width: 3rem;
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
```

- [ ] **Step 2: Test component compilation**

```bash
cd app
npm run typecheck
```
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add app/src/components/chat/CodeBlock.vue
git commit -m "feat: create CodeBlock component with copy and line numbers"
```

### Task 4: Update ChatMessage Component

**Files:**
- Modify: `app/src/components/chat/ChatMessage.vue`

- [ ] **Step 1: Update ChatMessage to detect and render code blocks**

```vue
<!-- In app/src/components/chat/ChatMessage.vue, update script section -->
<script setup lang="ts">
import { computed } from 'vue'
import { useCodeHighlight } from '@/composables/useCodeHighlight'
import CodeBlock from './CodeBlock.vue'
import type { Message } from '@/types'

const props = defineProps<{
  message: Message
  isSelected?: boolean
  isDeleting?: boolean
}>()

const emit = defineEmits<{
  (e: 'select'): void
}>()

const { detectCodeBlocks, extractTextWithoutCodeBlocks } = useCodeHighlight()

const codeBlocks = computed(() => {
  return detectCodeBlocks(props.message.content)
})

const textContent = computed(() => {
  return extractTextWithoutCodeBlocks(props.message.content)
})
</script>

<template>
  <div 
    class="message p-4 rounded-lg transition-colors"
    :class="[
      message.role === 'user' 
        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800' 
        : 'bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700',
      isSelected && 'ring-2 ring-blue-500 dark:ring-blue-400',
      isDeleting && 'opacity-50'
    ]"
    @click="emit('select')"
  >
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
        :class="message.role === 'user' 
          ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'">
        <span class="text-sm font-medium">
          {{ message.role === 'user' ? 'U' : 'AI' }}
        </span>
      </div>
      
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium"
            :class="message.role === 'user' 
              ? 'text-blue-700 dark:text-blue-300' 
              : 'text-gray-700 dark:text-gray-300'">
            {{ message.role === 'user' ? 'You' : 'Assistant' }}
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
          </span>
        </div>
        
        <!-- Render text content -->
        <div v-if="textContent.trim()" class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap mb-3">
          {{ textContent }}
        </div>
        
        <!-- Render code blocks -->
        <div v-if="codeBlocks.length > 0" class="space-y-3">
          <CodeBlock 
            v-for="(codeBlock, index) in codeBlocks" 
            :key="index"
            :code-block="codeBlock"
          />
        </div>
        
        <!-- Error display -->
        <div v-if="message.error" class="mt-2 text-sm text-red-600 dark:text-red-400">
          {{ message.error }}
        </div>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Test the updated component**

```bash
cd app
npm run typecheck
```
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add app/src/components/chat/ChatMessage.vue
git commit -m "feat: update ChatMessage to detect and render code blocks"
```

### Task 5: Add CSS for Highlight.js Theme

**Files:**
- Modify: `app/src/style.css`

- [ ] **Step 1: Import highlight.js theme**

```css
/* In app/src/style.css, add at the end */
@import 'highlight.js/styles/github.css';

/* Custom styles for code blocks */
.hljs {
  background: transparent !important;
  padding: 0 !important;
}

.code-block pre code.hljs {
  display: block;
  overflow-x: auto;
}

.code-block .line-numbers {
  user-select: none;
}
```

- [ ] **Step 2: Test the application**

```bash
cd app
npm run dev
```
Expected: Development server starts without errors

- [ ] **Step 3: Commit**

```bash
git add app/src/style.css
git commit -m "feat: add highlight.js theme styles"
```

### Task 6: Test Code Highlighting Feature

**Files:**
- Create test messages with code blocks

- [ ] **Step 1: Create test message with various code blocks**

```typescript
// Create a test file or manually test in browser
const testMessages = [
  {
    role: 'assistant' as const,
    content: `Here's an example in JavaScript:

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`)
  return \`Hello, \${name}!\`
}

// Call the function
greet('World')
\`\`\`

And here's some Python:

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
\`\`\`

And some HTML:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Example</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>This is a paragraph.</p>
</body>
</html>
\`\`\``
  }
]
```

- [ ] **Step 2: Test in browser**
1. Start dev server: `npm run dev`
2. Open http://localhost:5173
3. Send a message with code blocks
4. Verify:
   - Code blocks are detected and highlighted
   - Line numbers show for multi-line code
   - Copy button works
   - Different languages are highlighted correctly

- [ ] **Step 3: Test edge cases**
1. Test with unknown language (should fallback to plain text)
2. Test with single line code (no line numbers)
3. Test copy functionality
4. Test with very long code blocks

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete code highlighting feature implementation"
```
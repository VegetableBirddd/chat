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
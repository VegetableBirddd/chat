<script setup lang="ts">
import { watch } from 'vue'
import { useSearch } from '@/composables/useSearch'
import type { Session } from '@/stores/session'

const props = defineProps<{
  sessions: Session[]
}>()

const emit = defineEmits<{
  (e: 'select', sessionId: string, messageId?: string): void
  (e: 'close'): void
}>()

const { searchQuery, searchResults, isSearching, hasResults, hasQuery, initSearch, performSearch, clearSearch } = useSearch()
// searchInputRef removed - using autofocus attribute instead

watch(() => props.sessions, (sessions) => {
  initSearch(sessions)
}, { immediate: true })

function handleInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  performSearch(value)
}

function handleSelectResult(sessionId: string, messageId?: string) {
  emit('select', sessionId, messageId)
  clearSearch()
}

function handleClose() {
  clearSearch()
  emit('close')
}

function highlightMatch(content: string, query: string): string {
  if (!query.trim()) return content
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
  return content.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-700 px-0.5 rounded">$1</mark>')
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50" @click.self="handleClose">
    <div class="bg-white dark:bg-gray-800 rounded-2xl w-[500px] max-w-[90vw] max-h-[70vh] shadow-xl overflow-hidden flex flex-col">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref="searchInputRef"
            :value="searchQuery"
            @input="handleInput"
            placeholder="搜索会话或消息..."
            class="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
            autofocus
          />
          <button
            v-if="hasQuery"
            @click="clearSearch"
            class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-2">
        <div v-if="isSearching" class="flex items-center justify-center py-8">
          <svg class="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>

        <div v-else-if="hasQuery && !hasResults" class="text-center py-8 text-gray-500">
          未找到相关结果
        </div>

        <div v-else-if="hasResults" class="space-y-1">
          <div
            v-for="result in searchResults"
            :key="`${result.sessionId}-${result.messageId}`"
            @click="handleSelectResult(result.sessionId, result.messageId || undefined)"
            class="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ result.sessionTitle }}
              </span>
              <span class="text-xs text-gray-400">
                {{ new Date(result.timestamp).toLocaleDateString('zh-CN') }}
              </span>
            </div>
            <div
              class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
              v-html="highlightMatch(result.content, searchQuery)"
            />
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-400 text-sm">
          输入关键词开始搜索
        </div>
      </div>
    </div>
  </div>
</template>

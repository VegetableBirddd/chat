<script setup lang="ts">
import type { Message } from '@/types'

defineProps<{
  message: Message
}>()

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div
    class="flex gap-3 py-3"
    :class="message.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
  >
    <div
      class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
      :class="message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'"
    >
      {{ message.role === 'user' ? 'U' : 'AI' }}
    </div>
    <div class="flex flex-col max-w-[70%]" :class="message.role === 'user' ? 'items-end' : 'items-start'">
      <div
        class="px-4 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
        :class="message.role === 'user' ? 'bg-blue-500 text-white rounded-br-sm' : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-bl-sm'"
      >
        {{ message.content }}
      </div>
      <span class="text-xs text-gray-400 mt-1 px-1">{{ formatTime(message.timestamp) }}</span>
    </div>
  </div>
</template>
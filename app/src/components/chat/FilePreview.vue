<script setup lang="ts">
import type { UploadedFile } from '@/types'

const props = defineProps<{
  files: UploadedFile[]
}>()

const emit = defineEmits<{
  (e: 'remove', id: string): void
}>()

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function getFileIcon(type: string): string {
  if (type.startsWith('image/')) return '🖼️'
  if (type.includes('pdf')) return '📄'
  if (type.includes('word') || type.includes('document')) return '📝'
  if (type.includes('excel') || type.includes('sheet')) return '📊'
  return '📃'
}
</script>

<template>
  <div v-if="files.length > 0" class="flex flex-wrap gap-2">
    <div
      v-for="file in files"
      :key="file.id"
      class="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm group"
    >
      <span class="text-base">{{ getFileIcon(file.type) }}</span>
      <div class="flex flex-col">
        <span class="text-gray-700 dark:text-gray-300 truncate max-w-[150px]" :title="file.name">
          {{ file.name }}
        </span>
        <span class="text-xs text-gray-400">{{ formatSize(file.size) }}</span>
      </div>
      <button
        @click.stop="emit('remove', file.id)"
        class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </div>
</template>

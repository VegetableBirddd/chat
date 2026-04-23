<script setup lang="ts">
import { ref } from 'vue'
import type { ExportOptions } from '@/types'

const emit = defineEmits<{
  (e: 'export', options: ExportOptions): void
  (e: 'close'): void
}>()

const format = ref<'markdown' | 'pdf'>('markdown')
const includeMetadata = ref(true)
const includeSystemMessages = ref(false)

function handleExport() {
  emit('export', {
    format: format.value,
    includeMetadata: includeMetadata.value,
    includeSystemMessages: includeSystemMessages.value
  })
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="handleClose">
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-96 max-w-[90vw] shadow-xl">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">导出对话</h2>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">导出格式</label>
          <div class="flex gap-2">
            <button
              @click="format = 'markdown'"
              class="flex-1 py-2 px-3 rounded-lg text-sm border transition-colors"
              :class="format === 'markdown'
                ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'"
            >
              Markdown
            </button>
            <button
              @click="format = 'pdf'"
              class="flex-1 py-2 px-3 rounded-lg text-sm border transition-colors"
              :class="format === 'pdf'
                ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'"
            >
              PDF
            </button>
          </div>
        </div>

        <div class="space-y-3">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="includeMetadata"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">包含元数据（时间戳）</span>
          </label>

          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="includeSystemMessages"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">包含系统消息</span>
          </label>
        </div>
      </div>

      <div class="flex gap-3 mt-6">
        <button
          @click="handleClose"
          class="flex-1 py-2 rounded-xl text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          取消
        </button>
        <button
          @click="handleExport"
          class="flex-1 py-2 rounded-xl text-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          导出
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  isUploading?: boolean
}>()

const emit = defineEmits<{
  (e: 'files', files: FileList): void
}>()

const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement>()

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  if (e.dataTransfer?.files) {
    emit('files', e.dataTransfer.files)
  }
}

function handleClick() {
  fileInputRef.value?.click()
}

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) {
    emit('files', input.files)
    input.value = ''
  }
}
</script>

<template>
  <div
    class="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors"
    :class="[
      isDragging
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
      isUploading ? 'opacity-50 cursor-not-allowed' : ''
    ]"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    @click="handleClick"
  >
    <input
      ref="fileInputRef"
      type="file"
      multiple
      class="hidden"
      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.md,.csv,.png,.jpg,.jpeg,.gif,.webp"
      @change="handleFileChange"
    />

    <div v-if="isUploading" class="flex items-center justify-center gap-2 text-sm text-gray-500">
      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
      正在解析文件...
    </div>

    <div v-else class="flex flex-col items-center gap-1">
      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
      </svg>
      <span class="text-sm text-gray-500">点击或拖拽上传文件</span>
      <span class="text-xs text-gray-400">支持 PDF、Word、Excel、图片、文本（最多5个，单个10MB）</span>
    </div>
  </div>
</template>

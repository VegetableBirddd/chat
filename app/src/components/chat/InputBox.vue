<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useFileUpload } from '@/composables/useFileUpload'
import FileUpload from './FileUpload.vue'
import FilePreview from './FilePreview.vue'

const props = defineProps<{
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'send', content: string, files?: any[]): void
}>()

const chatStore = useChatStore()
const { uploadedFiles, isUploading, uploadError, handleFiles, removeFile, clearFiles } = useFileUpload()
const inputValue = ref('')
const textareaRef = ref<HTMLTextAreaElement>()

const canSend = computed(() => (inputValue.value.trim().length > 0 || uploadedFiles.value.length > 0) && !props.isLoading && !isUploading.value)

const canDelete = computed(() => chatStore.selectedCount > 0)

function handleSend() {
  if (!canSend.value) return
  emit('send', inputValue.value, uploadedFiles.value)
  inputValue.value = ''
  clearFiles()
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

function adjustHeight() {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 200) + 'px'
  }
}

function handleConfirmDelete() {
  if (!canDelete.value) return
  chatStore.deleteMessages(chatStore.selectedMessageIds)
}

function handleCancelDelete() {
  chatStore.exitDeleteMode()
}

const showFileUpload = ref(false)

function handleUploadClick() {
  showFileUpload.value = !showFileUpload.value
}
</script>

<template>
  <div class="px-6 pb-6" style="background-color: transparent;">
    <div v-if="chatStore.isDeleting" class="rounded-2xl p-4 shadow-lg" style="background-color: var(--bg-card); border: 1px solid var(--border-default);">
      <p class="text-sm text-center mb-3" style="color: var(--text-secondary);">
        已选择 <span class="font-semibold" style="color: var(--text-primary);">{{ chatStore.selectedCount }}</span> 条消息
      </p>
      <div class="flex gap-2">
        <button
          @click="handleCancelDelete"
          class="flex-1 py-2 rounded-xl text-sm transition-colors"
          style="background-color: var(--bg-input); color: var(--text-secondary);"
        >
          取消
        </button>
        <button
          @click="handleConfirmDelete"
          :disabled="!canDelete"
          class="flex-1 py-2 rounded-xl text-sm transition-colors"
          :class="canDelete ? 'bg-red-500 text-white hover:bg-red-600' : 'cursor-not-allowed'"
          :style="canDelete ? {} : { backgroundColor: 'var(--bg-input)', color: 'var(--text-tertiary)' }"
        >
          确认删除
        </button>
      </div>
    </div>
    <div v-else class="flex flex-col gap-2 rounded-2xl p-3 shadow-lg" style="background-color: var(--bg-card); border: 1px solid var(--border-default);">
      <FilePreview v-if="uploadedFiles.length > 0" :files="uploadedFiles" @remove="removeFile" />
      <div v-if="uploadError" class="text-xs text-red-500 px-2">{{ uploadError }}</div>
      <div class="flex items-end gap-2">
        <button
          @click="handleUploadClick"
          class="p-2 rounded-xl transition-colors shrink-0"
          style="color: var(--text-tertiary);"
          :disabled="isUploading"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
        <textarea
          ref="textareaRef"
          v-model="inputValue"
          placeholder="输入消息..."
          class="flex-1 bg-transparent resize-none outline-none text-sm py-2 px-2 max-h-48 placeholder-tertiary"
          :disabled="isLoading"
          @keydown="handleKeydown"
          @input="adjustHeight"
          rows="1"
        />
        <button
          @click="handleSend"
          :disabled="!canSend"
          class="rounded-xl transition-colors shrink-0 flex items-center justify-center"
          :class="canSend ? 'hover:opacity-90' : 'cursor-not-allowed'"
          :style="canSend
            ? { backgroundColor: 'var(--accent-primary)', color: 'white', width: '36px', height: '36px' }
            : { backgroundColor: 'var(--accent-user)', color: 'var(--accent-primary)', width: '36px', height: '36px' }"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
      <FileUpload v-if="showFileUpload" :is-uploading="isUploading" @files="handleFiles" />
    </div>
  </div>
</template>

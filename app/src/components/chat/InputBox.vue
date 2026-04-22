<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'send', content: string): void
}>()

const inputValue = ref('')
const textareaRef = ref<HTMLTextAreaElement>()

const canSend = computed(() => inputValue.value.trim().length > 0 && !props.isLoading)

function handleSend() {
  if (!canSend.value) return
  emit('send', inputValue.value)
  inputValue.value = ''
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
</script>

<template>
  <div class="px-4 pb-4">
    <div class="flex items-end gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl p-2">
      <textarea
        ref="textareaRef"
        v-model="inputValue"
        placeholder="输入消息..."
        class="flex-1 bg-transparent resize-none outline-none text-sm py-2 px-2 max-h-48"
        :disabled="isLoading"
        @keydown="handleKeydown"
        @input="adjustHeight"
        rows="1"
      />
      <button
        @click="handleSend"
        :disabled="!canSend"
        class="p-2 rounded-xl transition-colors"
        :class="canSend ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Message } from '@/types'
import { useChatStore } from '@/stores/chat'

const props = defineProps<{
  message: Message
}>()

const chatStore = useChatStore()
const isHovered = ref(false)
const editContent = ref('')
const copied = ref(false)

const isUser = computed(() => props.message.role === 'user')
const isEditing = computed(() => chatStore.editingMessageId === props.message.id)
const isSelected = computed(() => chatStore.selectedMessageIds.includes(props.message.id))
const showActions = computed(() => isUser.value && isHovered.value && !chatStore.isDeleting && !isEditing.value)

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function handleCopy() {
  navigator.clipboard.writeText(props.message.content)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function startEdit() {
  editContent.value = props.message.content
  chatStore.setEditingMessageId(props.message.id)
}

function saveEdit() {
  if (editContent.value.trim()) {
    chatStore.updateMessageContent(props.message.id, editContent.value.trim())
  }
  chatStore.setEditingMessageId(null)
}

function cancelEdit() {
  chatStore.setEditingMessageId(null)
}

function handleEditKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    saveEdit()
  } else if (e.key === 'Escape') {
    cancelEdit()
  }
}

function handleDeleteClick() {
  chatStore.enterDeleteMode()
  chatStore.toggleMessageSelection(props.message.id)
}

function handleCheckChange() {
  chatStore.toggleMessageSelection(props.message.id)
}
</script>

<template>
  <div
    class="flex gap-3 py-2"
    :class="message.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div
      class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0"
      :class="message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'"
    >
      {{ message.role === 'user' ? 'U' : 'AI' }}
    </div>
    <div class="flex flex-col max-w-[70%]" :class="message.role === 'user' ? 'items-end' : 'items-start'">
      <div class="flex items-start gap-2">
        <div v-if="chatStore.isDeleting" class="flex items-center pt-3">
          <input
            type="checkbox"
            :checked="isSelected"
            @change="handleCheckChange"
            class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
        </div>
        <div class="flex flex-col">
          <div v-if="isEditing" class="flex flex-col gap-2">
            <textarea
              v-model="editContent"
              class="px-4 py-2 rounded-2xl text-sm leading-relaxed bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 resize-none outline-none w-full"
              :class="message.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'"
              rows="3"
              @keydown="handleEditKeydown"
            />
            <div class="flex gap-2 justify-end">
              <button
                @click="cancelEdit"
                class="px-3 py-1 text-xs rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                取消
              </button>
              <button
                @click="saveEdit"
                class="px-3 py-1 text-xs rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                保存
              </button>
            </div>
          </div>
          <div
            v-else
            class="relative group px-4 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
            :class="[
              message.role === 'user' ? 'bg-blue-500 text-white rounded-br-sm' : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-bl-sm',
              isSelected && chatStore.isDeleting ? 'ring-2 ring-blue-400' : ''
            ]"
          >
            {{ message.content }}
            <div
              v-if="showActions"
              class="absolute -bottom-7 left-0 flex items-center gap-0.5 bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 px-1 py-0.5 animate-fade-in"
            >
              <button
                @click.stop="handleDeleteClick"
                class="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 relative group/btn"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none">
                  删除
                </span>
              </button>
              <button
                @click.stop="startEdit"
                class="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 relative group/btn"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none">
                  编辑
                </span>
              </button>
              <button
                @click.stop="handleCopy"
                class="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 relative group/btn"
              >
                <svg v-if="!copied" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <svg v-else class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none">
                  {{ copied ? '已复制' : '复制' }}
                </span>
              </button>
            </div>
          </div>
          <span class="text-xs text-gray-400 mt-1 px-1">{{ formatTime(message.timestamp) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.15s ease-out;
}
</style>

<script setup lang="ts">
import { onMounted } from 'vue'
import ChatContainer from './components/chat/ChatContainer.vue'
import Sidebar from './components/chat/Sidebar.vue'
import { useSessionStore } from './stores/session'

const sessionStore = useSessionStore()

onMounted(() => {
  sessionStore.loadFromStorage()
  if (sessionStore.sessions.length === 0) {
    sessionStore.createSession()
  } else {
    sessionStore.switchSession(sessionStore.sessions[0].id)
  }
})
</script>

<template>
  <div class="app-layout">
    <Sidebar />
    <ChatContainer />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow: hidden;
}
</style>
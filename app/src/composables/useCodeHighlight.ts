import { ref, onMounted } from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import type { CodeBlock } from '@/types'

export function useCodeHighlight() {
  const isLoaded = ref(false)

  onMounted(() => {
    isLoaded.value = true
  })

  function detectCodeBlocks(content: string): CodeBlock[] {
    const codeBlocks: CodeBlock[] = []
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    let match
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || 'plaintext'
      const code = match[2].trim()
      codeBlocks.push({
        language,
        code,
        lineNumbers: true
      })
    }
    
    return codeBlocks
  }

  function highlightCode(code: string, language: string): string {
    if (!isLoaded.value || !hljs.getLanguage(language)) {
      return code
    }
    
    try {
      return hljs.highlight(code, { language }).value
    } catch {
      return code
    }
  }

  function extractTextWithoutCodeBlocks(content: string): string {
    return content.replace(/```(\w+)?\n([\s\S]*?)```/g, '')
  }

  function copyToClipboard(text: string): Promise<void> {
    return navigator.clipboard.writeText(text)
  }

  return {
    isLoaded,
    detectCodeBlocks,
    highlightCode,
    extractTextWithoutCodeBlocks,
    copyToClipboard
  }
}
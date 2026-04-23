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

  function extractTextWithoutCodeBlocks(content: string): string {
    return content.replace(/```(\w+)?\n([\s\S]*?)```/g, '')
  }

  function parseMessageContent(content: string): Array<{ type: 'text' | 'code', content: string, codeBlock?: CodeBlock }> {
    const parts: Array<{ type: 'text' | 'code', content: string, codeBlock?: CodeBlock }> = []
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    let lastIndex = 0
    let match
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // 添加代码块之前的文本
      if (match.index > lastIndex) {
        const text = content.substring(lastIndex, match.index)
        if (text.trim()) {
          parts.push({
            type: 'text',
            content: text.trim()
          })
        }
      }
      
      // 添加代码块
      const language = match[1] || 'plaintext'
      const code = match[2].trim()
      const codeBlock: CodeBlock = {
        language,
        code,
        lineNumbers: true
      }
      parts.push({
        type: 'code',
        content: code,
        codeBlock
      })
      
      lastIndex = match.index + match[0].length
    }
    
    // 添加最后一个代码块之后的文本
    if (lastIndex < content.length) {
      const text = content.substring(lastIndex)
      if (text.trim()) {
        parts.push({
          type: 'text',
          content: text.trim()
        })
      }
    }
    
    return parts
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
    parseMessageContent,
    copyToClipboard
  }
}
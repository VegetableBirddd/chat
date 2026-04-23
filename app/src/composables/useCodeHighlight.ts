import { ref, onMounted } from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import type { CodeBlock } from '@/types'

export interface ContentSegment {
  type: 'text' | 'code'
  content?: string
  codeBlock?: CodeBlock
}

export function useCodeHighlight() {
  const isLoaded = ref(false)

  onMounted(() => {
    isLoaded.value = true
  })

  function detectCodeBlocks(content: string): CodeBlock[] {
    const codeBlocks: CodeBlock[] = []
    const codeBlockRegex = /```(\w+)?\r?\n([\s\S]{0,10000}?)```/g
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
    return content.replace(/```(\w+)?\r?\n([\s\S]{0,10000}?)```/g, '')
  }

  function parseContentSegments(content: string): ContentSegment[] {
    const segments: ContentSegment[] = []
    const codeBlockRegex = /```(\w+)?\r?\n([\s\S]{0,10000}?)```/g
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textContent = content.slice(lastIndex, match.index).trim()
        if (textContent) {
          segments.push({ type: 'text', content: textContent })
        }
      }

      const language = match[1] || 'plaintext'
      const code = match[2].trim()
      segments.push({
        type: 'code',
        codeBlock: {
          language,
          code,
          lineNumbers: true
        }
      })

      lastIndex = match.index + match[0].length
    }

    if (lastIndex < content.length) {
      const textContent = content.slice(lastIndex).trim()
      if (textContent) {
        segments.push({ type: 'text', content: textContent })
      }
    }

    return segments
  }

  function copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text)
    }

    return new Promise((resolve, reject) => {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        if (successful) {
          resolve()
        } else {
          reject(new Error('Failed to copy using execCommand'))
        }
      } catch (err) {
        document.body.removeChild(textArea)
        reject(err)
      }
    })
  }

  return {
    isLoaded,
    detectCodeBlocks,
    highlightCode,
    extractTextWithoutCodeBlocks,
    parseContentSegments,
    copyToClipboard
  }
}
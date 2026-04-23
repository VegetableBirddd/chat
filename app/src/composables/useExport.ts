import type { Message, ExportOptions } from '@/types'
import { jsPDF } from 'jspdf'

export function useExport() {
  function generateMarkdown(messages: Message[], options: ExportOptions): string {
    let markdown = '# 对话记录\n\n'

    if (options.includeMetadata) {
      markdown += `导出时间: ${new Date().toLocaleString('zh-CN')}\n\n`
    }

    for (const msg of messages) {
      if (!options.includeSystemMessages && msg.role === 'system') {
        continue
      }

      const roleLabel = msg.role === 'user' ? '用户' : msg.role === 'assistant' ? 'AI' : '系统'

      if (options.includeMetadata) {
        markdown += `## ${roleLabel} (${new Date(msg.timestamp).toLocaleString('zh-CN')})\n\n`
      } else {
        markdown += `## ${roleLabel}\n\n`
      }

      markdown += `${msg.content}\n\n`

      if (msg.files && msg.files.length > 0) {
        markdown += '**附件:**\n'
        for (const file of msg.files) {
          markdown += `- ${file.name} (${(file.size / 1024).toFixed(1)} KB)\n`
        }
        markdown += '\n'
      }
    }

    return markdown
  }

  function generatePDF(messages: Message[], options: ExportOptions): jsPDF {
    const doc = new jsPDF()
    let y = 20

    doc.setFontSize(18)
    doc.text('对话记录', 20, y)
    y += 15

    if (options.includeMetadata) {
      doc.setFontSize(10)
      doc.text(`导出时间: ${new Date().toLocaleString('zh-CN')}`, 20, y)
      y += 10
    }

    for (const msg of messages) {
      if (!options.includeSystemMessages && msg.role === 'system') {
        continue
      }

      if (y > 270) {
        doc.addPage()
        y = 20
      }

      const roleLabel = msg.role === 'user' ? '用户' : msg.role === 'assistant' ? 'AI' : '系统'

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 255)
      if (options.includeMetadata) {
        doc.text(`${roleLabel} (${new Date(msg.timestamp).toLocaleString('zh-CN')})`, 20, y)
      } else {
        doc.text(roleLabel, 20, y)
      }
      y += 8

      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      const lines = doc.splitTextToSize(msg.content, 170)
      doc.text(lines, 20, y)
      y += lines.length * 5 + 5

      if (msg.files && msg.files.length > 0) {
        doc.setFontSize(9)
        doc.setTextColor(100, 100, 100)
        doc.text('附件:', 20, y)
        y += 5
        for (const file of msg.files) {
          doc.text(`- ${file.name}`, 25, y)
          y += 4
        }
        y += 3
      }
    }

    return doc
  }

  function exportChat(messages: Message[], options: ExportOptions, title?: string) {
    if (messages.length === 0) {
      throw new Error('当前会话为空')
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const safeTitle = title?.replace(/[^\w\u4e00-\u9fa5]/g, '_') || 'chat'
    const filename = `chat-${safeTitle}-${timestamp}`

    if (options.format === 'markdown') {
      const markdown = generateMarkdown(messages, options)
      const blob = new Blob([markdown], { type: 'text/markdown' })
      downloadBlob(blob, `${filename}.md`)
    } else {
      const pdf = generatePDF(messages, options)
      pdf.save(`${filename}.pdf`)
    }
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return {
    exportChat,
    generateMarkdown,
    generatePDF
  }
}

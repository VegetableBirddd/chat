import { ref } from 'vue'
import type { UploadedFile } from '@/types'
import { processFiles } from '@/services/fileParser'

export function useFileUpload() {
  const uploadedFiles = ref<UploadedFile[]>([])
  const isUploading = ref(false)
  const uploadError = ref<string | null>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return

    isUploading.value = true
    uploadError.value = null

    try {
      const filesList = Array.from(files)
      const remainingSlots = 5 - uploadedFiles.value.length

      if (remainingSlots <= 0) {
        throw new Error('最多只能上传5个文件')
      }

      const filesToProcess = filesList.slice(0, remainingSlots)
      const newFiles = await processFiles(filesToProcess as unknown as FileList)
      uploadedFiles.value.push(...newFiles)
    } catch (err) {
      uploadError.value = err instanceof Error ? err.message : '文件上传失败'
    } finally {
      isUploading.value = false
    }
  }

  function removeFile(id: string) {
    const index = uploadedFiles.value.findIndex(f => f.id === id)
    if (index > -1) {
      uploadedFiles.value.splice(index, 1)
    }
  }

  function clearFiles() {
    uploadedFiles.value = []
    uploadError.value = null
  }

  return {
    uploadedFiles,
    isUploading,
    uploadError,
    handleFiles,
    removeFile,
    clearFiles
  }
}

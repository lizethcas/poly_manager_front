export function useFileHandling() {
  const updateCoverImage = (imageFile: File) => {
    const newFileName = imageFile.name.replace(/\s+/g, '_')
    return new File([imageFile], newFileName, { type: imageFile.type })
  }

  return {
    updateCoverImage
  }
} 
import { ref } from 'vue'
import { ApiService } from '~/services/create.course.api'
import { useCourseStore } from '~/stores/courseStore'
import { createCourse } from '~/data/cardModal'

export function useAddCourse(closeModal: () => void) {
  const courseStore = useCourseStore()
  const defaultCategory = createCourse.categorys[0]
  const defaultLevel = createCourse.levels[0]

  const handleSave = async (formData: any, bulletPoints: string[]) => {
    if (!formData.value?.course_name?.trim()) {
      alert('El nombre del curso es obligatorio')
      return
    }

    const formDataObj = new FormData()
    formDataObj.append('course_name', formData.value.course_name)
    formDataObj.append('bullet_points', JSON.stringify(bulletPoints))
    formDataObj.append('category', formData.value.category || defaultCategory)
    formDataObj.append('level', formData.value.level || defaultLevel)
    formDataObj.append('description', formData.value.description || '')

    if (formData.value.cover instanceof File) {
      formDataObj.append('cover', formData.value.cover)
    }

    const formDataToSave = {
      ...formData.value,
      bullet_points: bulletPoints,
      cover: formData.value.cover instanceof File ? URL.createObjectURL(formData.value.cover) : null
    }

    const apiService = new ApiService()
    await apiService.createCourse(formDataObj)
    courseStore.saveCourse(formDataToSave)

    closeModal()
  }

  return {
    handleSave
  }
} 
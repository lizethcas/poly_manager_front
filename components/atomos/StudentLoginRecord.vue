<script setup>
import { axiosDashboard } from '../../services/axios.config'

const recordStudentLogin = async (studentId) => {
  try {
    const response = await axiosDashboard.post('/student-login-record/', {
      student: studentId
    })
    return true
  } catch (error) {
    console.error('Error al registrar el login:', error)
    return false
  }
}

// Exportamos la función para usarla en otros componentes
defineExpose({
  recordStudentLogin
})
</script>

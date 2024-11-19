import type { FormDataModal } from '~/interfaces/modal.interface';
import { URL_API } from './api';
class ApiService {
    async createCourse(formData: FormDataModal) {
        const response = await $fetch(`${URL_API}/api/courses`, {
            method: 'POST',
            body: formData
        })
    }

}   

export default new ApiService();

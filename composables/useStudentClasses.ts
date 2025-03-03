import { useQuery } from '@tanstack/vue-query';
import { axiosDashboard } from '~/services/axios.config';
import { routes } from '~/data/routes';

interface StudentClass {
  // Add your class type definition here based on your API response
  id: number;
  name: string;
  // ... other properties
}

export const useStudentClasses = () => {
  

  const getTotalStudents = async (courseId: string) => {
    const { data } = await axiosDashboard.get(routes.routesStudent.totalStudentsbyCourse(courseId));
    console.log(data);
    return data;
  };

  return {
   
    getTotalStudents
  };
}; 
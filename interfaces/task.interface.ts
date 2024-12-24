export interface BaseTaskData {
  class_id: string | number | string[];
  content_type: string;
  tittle: string;
  instructions: string;
  stats: boolean;
}

export function createBaseTaskData(classId: string | number, contentType: string): BaseTaskData {
  return {
    class_id: classId,
    content_type: contentType,
    tittle: '',
    instructions: '',
    stats: false
  };
} 
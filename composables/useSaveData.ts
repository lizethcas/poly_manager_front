import type { Question } from "~/interfaces/components/props.components.interface";

export const useSaveData = () => {
  const layoutBlockData = (data: any, questions: Question[]) => {
    data.value = {
      ...data.value,
      title: data.value.title,
      instructions: data.value.instructions,
      questions: toRaw(questions),
    };
  };

  const videoBlockData = (data: any, script: string, video: string) => {
    data.value = {
      ...data.value,
      title: data.value.title,
      instructions: data.value.instructions,
      video_file: video,
      script: script,
    };
  };

  return { layoutBlockData, videoBlockData };
};

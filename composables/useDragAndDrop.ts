import type { Question } from "~/interfaces/components/props.components.interface";
import type { Ref } from "vue";

export function useDragAnDrop(items: Ref<Question[]>) {
  const onDragStart = (event: DragEvent, index: number) => {
    event.dataTransfer?.setData("index", index.toString());
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const onDrop = (event: DragEvent, targetIndex: number) => {
    const draggedIndex = Number(event.dataTransfer?.getData("index"));
    if (draggedIndex !== targetIndex) {
      const draggedItem = items.value[draggedIndex];
      items.value.splice(draggedIndex, 1);
      items.value.splice(targetIndex, 0, draggedItem);
    }
  };

  return { onDragOver, onDrop, onDragStart };
}

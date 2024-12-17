import type { Ref } from "vue";
import type { ClassData } from "~/interfaces/models/class.interface..model";

export function useDragAnDrop(items: Ref<ClassData[]>) {
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

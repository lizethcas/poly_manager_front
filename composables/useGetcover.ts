export const useGetCover = () => {
  const getCoverUrl = (cover: string | File) => {
    if (cover instanceof File) {
      const objectUrl = URL.createObjectURL(cover);
      onUnmounted(() => URL.revokeObjectURL(objectUrl)); // Revoca la URL cuando el componente se desmonta
      return objectUrl;
    }
    return typeof cover === "string" && cover !== ""
      ? cover
      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQumqw6UawRn7rOgAvevIfEnX55015CA-oTeA&s";
  };
  return { getCoverUrl };
};

export const useGetCover = () => {
  const getCoverUrl = (cover: string | File): string => {
    if (cover instanceof File) {
      return URL.createObjectURL(cover);
    }
    return typeof cover === "string" && cover !== ""
      ? cover
      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQumqw6UawRn7rOgAvevIfEnX55015CA-oTeA&s";
  };
  return { getCoverUrl };
};

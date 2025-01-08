
interface TaskOption {
  name: string;
  type: string;
}

export const interactiveTaskOptions: TaskOption[] = [
  {
    name: "Multiple choice",
    type: "multiple_choice",
  },
  {
    name: "True or false",
    type: "true_false",
  },
  {
    name: "Fill in the gaps",
    type: "fill_gaps",
  },
  {
    name: "Word bank",
    type: "word_bank",
  },

 /*  {
    name: "Drop Down Text",
    type: "drop_down_text",
  }, */

  /* {
    name: "Put in order",
    type: "ordering",
  }, */
  /* {
    name: "Sorting",
    type: "sorting",
  }, */
  {
    name: "Categories",
    type: "category",
  },
 /*  {
    name: "Matching",
    type: "Matching",
  }, */
 /*  {
    name: "Word Order",
    type: "word_order",
  }, */
 /*  {
    name: "Picture  Matching",
    type: "picture_matching",
  }, */
  /* {
    name: "Picture Labeling  ",
    type: "picture_labeling",
  }, */
];


export const multimediaBlockOptions : TaskOption[] = [
  {
    name: "Video",
    type: "video",
  },
  {
    name: "Audio",
    type: "audio",
  },
]

export const textBlockOptions : TaskOption[] = [
  {
    name: "Plain Text",
    type: "text_block",
  },
  {
    name: "Info Box",
    type: "info_box",
  },
]


export const galletyLayoutOptions : TaskOption[] = [
  {
    name: "images",
    type: "images",
  },
]
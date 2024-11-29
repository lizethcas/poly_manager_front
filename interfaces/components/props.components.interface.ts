export interface ImgAtomProps {
  image: string;
  alt: string;
}

export interface ButtonAtomProps {
  text?: string;
  type: string;
  size?: string;
  icon?: string;
  defaultLabel?: string;
}

export interface PropsInteractiveTask extends ImgAtomProps {
  title: string;
 
}

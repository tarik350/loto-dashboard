export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}
export type sidebarItemType = {
  title: string;
  icon: React.FC<SvgProps>;
  className?: string;
  route: string;
  subRoute?: { title: string; icon: React.FC<SvgProps>; route: string }[];
};
export interface SvgProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  strokeColor?: string;
}

// Generic response interface
export interface GenericResponse<T> {
  status: number;
  message: string;
  data: T | null;
  error?: string;
}

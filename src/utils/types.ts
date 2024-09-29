export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}
export type sidebarItemType = {
  title: string;
  icon: React.FC<SvgProps>;
  className?: string;
  route: string;
  //   subMenu?: { title: string; icon: React.FC<SvgProps>; className?: string }[];
};
export interface SvgProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  strokeColor?: string;
}

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
  error?: Record<string, string[]> | string;
}

interface Error {
  query: string[];
}

// {
//   "message": "Validation error occurred",
//   "status": 422,
//   "error": {
//       "query": [
//           "The query field is required."
//       ]
//   }
// }

export type QueryByTypeForUser = "Name" | "ID" | "Phone";
export const queryByConstForUser: QueryByTypeForUser[] = [
  "Name",
  "ID",
  "Phone",
];

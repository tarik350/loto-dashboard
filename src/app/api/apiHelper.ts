import { GenericResponse } from "@/utils/types";

const createResponse = <T>(
  status: number,
  message: string,
  content: T
): GenericResponse<T> => {
  return { status, message, content };
};

export { createResponse };

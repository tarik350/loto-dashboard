import { NextRequest } from "next/server";

const validateSignupRequestPaylaod = async (
  request: NextRequest
): Promise<Record<string, any> | null> => {
  const { email, password, username } = await request.json();

  if (!email || !password || !username) {
    return {
      message: "Please provide all the fields. username , email and password",
      error: "Validation error",
      status: 400,
    };
  }
  return null;
};

export { validateSignupRequestPaylaod };

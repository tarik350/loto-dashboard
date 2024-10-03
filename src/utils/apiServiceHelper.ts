interface ApiProps {
  url: string;
}

interface PostApiProps extends ApiProps {
  method: string;
  body: Record<string, any>;
}
interface GetApiProps extends ApiProps {
  params?: Record<string, any>;
}
export async function authenticatedGet({ url, params }: GetApiProps) {
  try {
    if (params) {
      url = url + new URLSearchParams(params);
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}
export async function authenticatedPost({ url, method, body }: PostApiProps) {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function get({ url, params }: GetApiProps) {
  try {
    if (params) {
      url = url + new URLSearchParams(params);
    }
    const response = await fetch(url, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}
export async function post({ url, method, body }: PostApiProps) {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response;
  } catch (error) {
    throw error;
  }
}

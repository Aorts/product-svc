export interface StatusResponse {
  code: number;
  message: string;
}

export interface ApiResponse<T = any> {
  status: StatusResponse;
  data: T;
}

export function success<T>(
  data: T,
  message: string,
  code: number,
): ApiResponse<T> {
  return {
    status: { code, message },
    data,
  };
}

export function failure(
  message: string,
  code: number,
): ApiResponse<null> {
  return {
    status: { code, message },
    data: null,
  };
}

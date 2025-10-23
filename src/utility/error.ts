export class AppError extends Error {
  constructor(
    public message: string,
    public status = 400,
    public code: string = "BAD_REQUEST",
  ) {
    super(message);
  }
}

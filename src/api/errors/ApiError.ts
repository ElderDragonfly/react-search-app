export class ApiError extends Error {
  public status: number;
  public statusText: string;
  constructor(status: number, statusText: string) {
    super(`Api Error: ${status}`);
    this.status = status;
    this.statusText = statusText;
  }
}

import { NextResponse } from "next/server";

export function successResponse<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, ...data }, init);
}

export function errorResponse(
  error: string,
  status = 400,
  code = "REQUEST_ERROR"
) {
  return NextResponse.json(
    {
      success: false,
      error,
      code
    },
    { status }
  );
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  // Admin route protection is handled client-side via useAuth hook
  // (token stored in localStorage, sent via Authorization header)
  return NextResponse.next();
}

export const config = {
  matcher: [],
};

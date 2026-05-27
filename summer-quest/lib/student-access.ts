import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 8;
const ACCESS_CODE_SALT = "summer-quest-student-access";
const ACCESS_TOKEN_SALT = "summer-quest-student-token";

export const studentAccessCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: ACCESS_COOKIE_MAX_AGE,
};

export function normalizeStudentAccessCode(accessCode: string): string {
  return accessCode.trim();
}

export function isValidStudentAccessCode(accessCode: string): boolean {
  const normalized = normalizeStudentAccessCode(accessCode);
  return normalized.length >= 4 && normalized.length <= 24;
}

export function hashStudentAccessCode(accessCode: string): string {
  return createHash("sha256")
    .update(`${ACCESS_CODE_SALT}:${normalizeStudentAccessCode(accessCode)}`)
    .digest("hex");
}

export function studentAccessCookieName(studentId: string): string {
  return `sq_student_${studentId}_access`;
}

export function studentAccessToken(studentId: string, accessCodeHash: string): string {
  return createHash("sha256")
    .update(`${ACCESS_TOKEN_SALT}:${studentId}:${accessCodeHash}`)
    .digest("hex");
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function hasValidStudentAccessCookie(
  cookieValue: string | undefined,
  studentId: string,
  accessCodeHash?: string | null,
): boolean {
  if (!accessCodeHash) {
    return true;
  }

  if (!cookieValue) {
    return false;
  }

  return safeEqual(cookieValue, studentAccessToken(studentId, accessCodeHash));
}

export async function hasStudentAccess(studentId: string, accessCodeHash?: string | null): Promise<boolean> {
  const cookieStore = await cookies();
  return hasValidStudentAccessCookie(
    cookieStore.get(studentAccessCookieName(studentId))?.value,
    studentId,
    accessCodeHash,
  );
}

export async function requireStudentAccessOrRedirect(
  studentId: string,
  accessCodeHash?: string | null,
): Promise<void> {
  if (!(await hasStudentAccess(studentId, accessCodeHash))) {
    redirect(`/student/${studentId}/unlock`);
  }
}

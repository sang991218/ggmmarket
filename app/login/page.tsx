import Link from "next/link";
import { login } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  return (
    <LoginContent searchParams={searchParams} />
  );
}

async function LoginContent({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
          <span className="text-primary">고구마마켓</span>에 로그인
        </h1>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="이메일을 입력해주세요"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="비밀번호를 입력해주세요"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          {message && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {message}
            </p>
          )}

          <button
            formAction={login}
            className="w-full rounded-lg bg-primary py-3 text-base font-bold text-white hover:bg-primary-dark"
          >
            로그인
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          아직 계정이 없으신가요?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}

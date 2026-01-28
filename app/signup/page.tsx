import Link from "next/link";
import { signup } from "./actions";

export default function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  return <SignupContent searchParams={searchParams} />;
}

async function SignupContent({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
          <span className="text-primary">고구마마켓</span> 회원가입
        </h1>

        <form className="space-y-4">
          <div>
            <label htmlFor="nickname" className="mb-1 block text-sm font-medium text-gray-700">
              닉네임
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              required
              placeholder="닉네임을 입력해주세요"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

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
              minLength={6}
              placeholder="비밀번호를 입력해주세요 (6자 이상)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          {message && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {message}
            </p>
          )}

          <button
            formAction={signup}
            className="w-full rounded-lg bg-primary py-3 text-base font-bold text-white hover:bg-primary-dark"
          >
            회원가입
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}

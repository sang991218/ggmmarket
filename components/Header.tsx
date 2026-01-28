import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-screen-md items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          고구마마켓
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/my"
              className="text-sm font-medium text-gray-700 hover:text-primary"
            >
              마이페이지
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-primary"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

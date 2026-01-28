"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nickname = formData.get("nickname") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname,
      },
    },
  });

  if (error) {
    redirect("/signup?message=" + encodeURIComponent("회원가입에 실패했습니다. 다시 시도해주세요."));
  }

  revalidatePath("/", "layout");
  redirect("/login?message=" + encodeURIComponent("회원가입이 완료되었습니다. 이메일을 확인해주세요."));
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface ProfileEditorProps {
  nickname: string;
  location: string;
}

export default function ProfileEditor({ nickname, location }: ProfileEditorProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [nick, setNick] = useState(nickname);
  const [loc, setLoc] = useState(location);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!nick.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        nickname: nick.trim(),
        location: loc.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      alert("프로필 수정에 실패했습니다.");
      return;
    }

    setEditing(false);
    router.refresh();
  };

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary-light"
      >
        프로필 수정
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-5">
        <h3 className="mb-4 text-lg font-bold text-gray-900">프로필 수정</h3>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">닉네임</label>
            <input
              type="text"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">위치</label>
            <input
              type="text"
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              placeholder="예: 서울시 강남구"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => setEditing(false)}
            className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? "저장중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

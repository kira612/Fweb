import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // ログイン後のリダイレクト先 (デフォルトはプロフィールページ)
    const next = searchParams.get("next") ?? "/profile";

    if (code) {
        const cookieStore = cookies();
        console.log('Cookies in callback:', cookieStore.getAll().map(c => c.name));
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // Server Componentからの呼び出し時は無視
                        }
                    },
                },
            }
        );
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        } else {
            console.error('Auth Error:', error);
        }
    }

    // エラー時はログインページに戻す
    return NextResponse.redirect(`${origin}/login?error=auth`);
}

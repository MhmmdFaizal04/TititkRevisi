import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protect member routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/preview")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Block admin accounts from member area
    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (adminProfile) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    // Check payment confirmed (only for /dashboard)
    if (pathname.startsWith("/dashboard")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("payment_status")
        .eq("id", user.id)
        .single();
      if (!profile || profile.payment_status !== "confirmed") {
        return NextResponse.redirect(new URL("/preview", request.url));
      }
    }
  }

  // If already logged in and visiting /admin/login, redirect appropriately
  if (pathname === "/admin/login" && user) {
    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (adminProfile) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    // Regular user trying to access admin login — send them away
    return NextResponse.redirect(new URL("/preview", request.url));
  }

  // Protect admin routes (not admin login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!adminProfile) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Redirect logged-in users away from auth pages
  if ((pathname === "/login" || pathname === "/register") && user) {
    // Admin goes to admin dashboard
    const { data: adminProfile } = await supabase
      .from("admin_profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (adminProfile) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    // Regular user — check payment status
    const { data: profile } = await supabase
      .from("profiles")
      .select("payment_status")
      .eq("id", user.id)
      .single();
    if (profile?.payment_status === "confirmed") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/preview", request.url));
  }

  return supabaseResponse;
}


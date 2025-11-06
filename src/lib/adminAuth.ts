function parseCookies(cookieHeader: string | null) {
  if (!cookieHeader) return {};
  return cookieHeader
    .split(";")
    .map((c) => c.trim())
    .reduce((acc: any, cur) => {
      const [k, ...v] = cur.split("=");
      acc[k] = decodeURIComponent(v.join("="));
      return acc;
    }, {} as Record<string, string>);
}

export async function assertAdmin(req: Request) {
  // Local-only: accept admin session if cookie is_admin=1 or x-admin-secret header matches ADMIN_SECRET
  const cookieHeader = req.headers.get("cookie");
  const cookies = parseCookies(cookieHeader);
  if (cookies.is_admin === "1") return true;

  const secret = req.headers.get("x-admin-secret");
  if (secret && process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET)
    return true;

  return false;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      cache: "no-store",
      ...options,
    })
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error("API Fetch Error:", error)
    return null
  }
}

async function supaFetch(path: string, params: Record<string, string> = {}) {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
    return null
  }
  const url = new URL(`${SUPABASE_URL}/rest/v1/${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), {
    headers: {
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${SUPABASE_ANON}`,
      Accept: "application/json",
    },
    cache: "no-store",
  })
  if (!res.ok) {
    console.error("Supabase fetch error", await res.text())
    return null
  }
  return res.json()
}

// Public reads from Supabase for Products/Categories
export async function getCategories() {
  return supaFetch("categories", { select: "*", order: "name.asc" })
}

export async function getCategoryBySlug(slug: string) {
  const rows = await supaFetch("categories", { select: "*", slug: `eq.${slug}`, limit: "1" })
  return Array.isArray(rows) && rows.length ? rows[0] : null
}

export async function getProducts(categorySlug?: string) {
  if (!categorySlug) {
    return supaFetch("products", { select: "*", order: "created_at.desc" })
  }
  // get category id by slug then fetch products by category_id
  const catRows = await supaFetch("categories", { select: "id", slug: `eq.${categorySlug}`, limit: "1" })
  if (!Array.isArray(catRows) || !catRows.length) return []
  const catId = catRows[0].id as number
  return supaFetch("products", { select: "*", "category_id": `eq.${catId}`, order: "created_at.desc" })
}

export async function getProductBySlug(slug: string) {
  const rows = await supaFetch("products", { select: "*", slug: `eq.${slug}`, limit: "1" })
  return Array.isArray(rows) && rows.length ? rows[0] : null
}

// Keep inquiry posting to your FastAPI backend
export async function submitInquiry(data: { name: string; email: string; phone: string; subject?: string; message: string }) {
  return fetchAPI("/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
}
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            cache: 'no-store', // Use 'force-cache' or 'no-store' as needed
            ...options,
        });
        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("API Fetch Error:", error);
        return null; // Return null or a default value on error
    }
}

export async function getCategories() {
    return fetchAPI('/categories');
}

export async function getCategoryBySlug(slug: string) {
    return fetchAPI(`/categories/${slug}`);
}

export async function getProducts(categorySlug?: string) {
    const endpoint = categorySlug ? `/products?category=${categorySlug}` : '/products';
    return fetchAPI(endpoint);
}

export async function getProductBySlug(slug: string) {
    return fetchAPI(`/products/${slug}`);
}

export async function submitInquiry(data: { name: string; email: string; message: string; }) {
    return fetchAPI('/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}
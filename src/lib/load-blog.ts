import type { BlogConfig } from '@/app/blog/types'
import { fetchRepoJson, fetchRepoText, normalizeRouteParam, resolveRepoAssetUrl } from '@/lib/repo-content'

export type { BlogConfig } from '@/app/blog/types'

export type LoadedBlog = {
	slug: string
	config: BlogConfig
	markdown: string
	cover?: string
}

/**
 * Load blog data from public/blogs/{slug}
 * Used by both view page and edit page
 */
export async function loadBlog(slug: string): Promise<LoadedBlog> {
	const normalizedSlug = normalizeRouteParam(slug)

	if (!normalizedSlug) {
		throw new Error('Slug is required')
	}

	let config: BlogConfig = {}
	try {
		config = await fetchRepoJson<BlogConfig>(`public/blogs/${normalizedSlug}/config.json`, `/blogs/${encodeURIComponent(normalizedSlug)}/config.json`)
	} catch {
		config = {}
	}

	let markdown = ''
	try {
		markdown = await fetchRepoText(`public/blogs/${normalizedSlug}/index.md`, `/blogs/${encodeURIComponent(normalizedSlug)}/index.md`)
	} catch {
		throw new Error('Blog not found')
	}

	return {
		slug: normalizedSlug,
		config,
		markdown,
		cover: resolveRepoAssetUrl(config.cover)
	}
}

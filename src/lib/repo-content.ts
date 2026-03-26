import { GITHUB_CONFIG } from '@/consts'

export function normalizeRouteParam(value?: string | null): string {
	if (!value) return ''
	try {
		return decodeURIComponent(value)
	} catch {
		return value
	}
}

export function getRepoFileUrl(path: string): string {
	const normalizedPath = path.replace(/^\/+/, '')
	return `https://raw.githubusercontent.com/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/${GITHUB_CONFIG.BRANCH}/${normalizedPath}`
}

export function resolveRepoAssetUrl(url?: string | null): string | undefined {
	if (!url) return undefined
	if (/^(https?:)?\/\//.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
		return url
	}
	if (!url.startsWith('/')) {
		return url
	}
	return getRepoFileUrl(`public${url}`)
}

async function fetchFromCandidates(candidates: string[]): Promise<Response> {
	let lastError: Error | null = null

	for (const url of candidates) {
		try {
			const res = await fetch(url, { cache: 'no-store' })
			if (res.ok) return res
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error))
		}
	}

	if (lastError) throw lastError
	throw new Error('Fetch failed')
}

export async function fetchRepoJson<T>(repoPath: string, publicPath: string): Promise<T> {
	const res = await fetchFromCandidates([getRepoFileUrl(repoPath), publicPath])
	return res.json()
}

export async function fetchRepoText(repoPath: string, publicPath: string): Promise<string> {
	const res = await fetchFromCandidates([getRepoFileUrl(repoPath), publicPath])
	return res.text()
}

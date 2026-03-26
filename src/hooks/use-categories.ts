'use client'

import useSWR from 'swr'
import { fetchRepoJson } from '@/lib/repo-content'

export type CategoriesConfig = {
	categories: string[]
}

const fetcher = async (): Promise<CategoriesConfig> => {
	let data: unknown
	try {
		data = await fetchRepoJson<unknown>('public/blogs/categories.json', '/blogs/categories.json')
	} catch {
		return { categories: [] }
	}
	if (Array.isArray(data)) {
		return { categories: data.filter((item): item is string => typeof item === 'string') }
	}
	if (Array.isArray((data as any)?.categories)) {
		return { categories: (data as any).categories.filter((item: unknown): item is string => typeof item === 'string') }
	}
	return { categories: [] }
}

export function useCategories() {
	const { data, error, isLoading } = useSWR<CategoriesConfig>('blog-categories', fetcher, {
		revalidateOnFocus: false,
		revalidateOnReconnect: true
	})

	return {
		categories: data?.categories ?? [],
		loading: isLoading,
		error
	}
}

'use client'

import { useState } from 'react'
import { DialogModal } from '@/components/dialog-modal'
import { resolveRepoAssetUrl } from '@/lib/repo-content'

type MarkdownImageProps = {
	src: string
	alt?: string
	title?: string
}

export function MarkdownImage({ src, alt = '', title = '' }: MarkdownImageProps) {
	const [display, setDisplay] = useState(false)
	const resolvedSrc = resolveRepoAssetUrl(src) || src

	return (
		<>
			<img src={resolvedSrc} alt={alt} title={title} loading='lazy' onClick={() => setDisplay(true)} className='cursor-pointer transition-opacity hover:opacity-80' />
			<DialogModal open={display} onClose={() => setDisplay(false)} className='max-w-none bg-transparent p-0'>
				<img src={resolvedSrc} alt={alt} className='max-h-[90vh] max-w-full rounded-2xl object-contain' />
			</DialogModal>
		</>
	)
}

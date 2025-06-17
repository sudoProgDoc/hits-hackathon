import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { IMenuItem } from '@/types/sidebar.types'

export function MenuItem({ item }: { item: IMenuItem }) {
	const pathname = usePathname()
	return (
		<div>
			<Link
				href={item.link}
				className={`w-56 flex gap-2.5 items-center py-1.5 mt-2 px-4 transition-colors ${pathname === item.link ? 'bg-colors-primaryLight text-white' : 'hover:bg-colors-primaryElement'} rounded-lg`}
			>
				<item.icon />
				<span>{item.name}</span>
			</Link>
		</div>
	)
}

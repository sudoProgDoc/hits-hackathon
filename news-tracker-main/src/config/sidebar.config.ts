import { Heart, House, Inbox, Settings } from 'lucide-react'

import { IMenuItem } from '@/types/sidebar.types'

import { DASHBOARD_PAGES } from './pages-url.config'

export const ADMIN_MENU: IMenuItem[] = [
	{
		icon: House,
		link: DASHBOARD_PAGES.HOME,
		name: 'Home'
	},
	{
		icon: Heart,
		link: DASHBOARD_PAGES.FAVORITES,
		name: 'Favorites'
	},
	{
		icon: Inbox,
		link: DASHBOARD_PAGES.POSTPONEDS,
		name: 'Postponeds'
	},
	{
		icon: Settings,
		link: DASHBOARD_PAGES.SETTINGS,
		name: 'Settings'
	}
]

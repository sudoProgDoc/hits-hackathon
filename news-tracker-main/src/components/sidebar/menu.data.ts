import { IMenuItem } from '@/types/sidebar.types'

import { ADMIN_MENU } from '@/config/sidebar.config'

export const getMenu = (path: string): IMenuItem[] => {
	return path.includes('/i') ? ADMIN_MENU : [ADMIN_MENU[0]]
}

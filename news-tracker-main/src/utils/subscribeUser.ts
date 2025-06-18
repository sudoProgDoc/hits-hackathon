import { axiosWithAuth } from '@/api/interceptors'

export async function subscribeUser() {
	if ('serviceWorker' in navigator && 'PushManager' in window) {
		const registration = await navigator.serviceWorker.register('/sw.js')
		console.log('✅ Service Worker зарегистрирован')

		const permission = await Notification.requestPermission()
		if (permission !== 'granted') {
			console.warn('⛔ Разрешение на уведомления не выдано')
			return
		}

		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
		})

		console.log('✅ Пользователь подписан', subscription)

		// Отправь подписку на свой backend (Python)
		await axiosWithAuth.post('/save-subscription', subscription)
	}
}

function urlBase64ToUint8Array(base64String: any) {
	const padding = '='.repeat((4 - (base64String?.length % 4)) % 4)
	const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

	const raw = window.atob(base64)
	const output = new Uint8Array(raw?.length)

	for (let i = 0; i < raw?.length; ++i) {
		output[i] = raw.charCodeAt(i)
	}

	return output
}

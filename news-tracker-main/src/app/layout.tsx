import type { Metadata } from 'next'
import { Roboto_Mono, Montserrat } from 'next/font/google'
import './globals.scss'
import { ReactNode } from 'react'
import { SITE_NAME } from '../constants/seo.constants'
import { Toaster } from 'sonner'
import { Providers } from './providers'

const montserratSans = Montserrat({
	variable: '--font-montserrat',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	display: 'swap',
	style: ['normal', 'italic'],
})

// const robotoMono = Roboto_Mono({
// 	variable: '--font-roboto',
// 	subsets: ['latin'],
// 	weight: ['400', '500', '600', '700'],
// 	display: 'swap',
// 	style: ['normal', 'italic'],
// })

export const metadata: Metadata = {
	title: SITE_NAME,
	description: `%s | ${SITE_NAME}`,
}

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<html lang="en" data-lt-installed="true">
			<body
				className={`${montserratSans.className} antialiased w-full h-screen bg-colors-primary text-colors-text`}
			>
				<Providers>
					{children}

					<Toaster duration={1500} />
				</Providers>
			</body>
		</html>
	)
}

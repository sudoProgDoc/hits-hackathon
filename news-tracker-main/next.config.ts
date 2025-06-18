import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	eslint: {
		ignoreDuringBuilds: true
	},
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '3001',
				pathname: '/**',
				search: ''
			}
		]
	}
}

export default nextConfig

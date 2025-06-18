import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/buttons'
import { Heading } from '@/components/ui/Heading'
import Link from 'next/link'

export default function Home() {
	const navHover =
		'hidden group-hover:block absolute -bottom-1 left-0 w-full h-[2px] bg-colors-black'
	return (
		<main className="flex items-center justify-center h-full">
			<Box className="text-center">
				<Heading title="News Aggregator" />
				<p className="mt-4 mb-8">
					Intelligent news aggregation for Russian stock market traders
				</p>
				<Link href="/auth">
					<Button className="w-full">Get Started</Button>
				</Link>
			</Box>
		</main>
	)
}

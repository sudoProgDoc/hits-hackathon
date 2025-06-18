/** @type {import('jest').Config} */
const nextJest = require('next/jest')

const createJestConfig = nextJest({
	dir: './'
})

const customJestConfig = {
	testEnvironment: 'jest-environment-jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	testEnvironment: 'jsdom',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1'
	}
}

module.exports = createJestConfig(customJestConfig)

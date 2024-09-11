import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default async function () {
    const tsconfigPaths = await import('vite-tsconfig-paths').then(m => m.default)

    return defineConfig({
        plugins: [react(), tsconfigPaths()],
        test: {
            environment: 'jsdom',
            // setupFiles: ['./vitest.setup.ts'],
        },
    })
}
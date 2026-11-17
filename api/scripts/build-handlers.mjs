#!/usr/bin/env node
import * as esbuild from 'esbuild'
import { readdirSync, existsSync, statSync } from 'fs'
import { join } from 'path'

function findHandlerEntries(dir, base = '') {
    const entries = {}
    const items = readdirSync(dir)
    for (const item of items) {
        const full = join(dir, item)
        const rel = base ? `${base}/${item}` : item
        const stat = statSync(full)
        if (stat.isDirectory()) {
            const indexPath = join(full, 'index.ts')
            if (existsSync(indexPath)) {
                entries[rel] = indexPath
            } else {
                Object.assign(entries, findHandlerEntries(full, rel))
            }
        }
    }
    return entries
}

const handlersDir = join(process.cwd(), 'src/handlers')
const outDir = join(process.cwd(), 'dist/lambdas')
const entries = findHandlerEntries(handlersDir)

const entryPoints = Object.fromEntries(
    Object.entries(entries).map(([rel]) => [
        `${rel}/index`,
        join(handlersDir, rel, 'index.ts')
    ])
)

await esbuild.build({
    entryPoints,
    bundle: true,
    minify: true,
    keepNames: true,
    sourcemap: true,
    sourcesContent: false,
    target: 'node24',
    platform: 'node',
    outdir: outDir,
    loader: {
        '.html': 'text'
    }
})

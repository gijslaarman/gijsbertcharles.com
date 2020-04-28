import alias from '@rollup/plugin-alias'
import resolve from '@rollup/plugin-node-resolve'

const localConfig = {
    input: 'src/assets/js/index.js',
    output: [
        {
            file: 'public/main.js',
            format: 'cjs'
        }
    ],
    plugins: [
        resolve(),
        alias({
            entries: [
                { find: '@components', replacement: '../../components'}
            ]
        })
    ]
}

const productionConfig = {
    input: 'src/assets/js/index.js',
    output: [
        {
            file: 'public/main.js',
            format: 'es'
        }
    ]
}

// const config = process.env.ENVIRONMENT === 'local' ? localConfig : productionConfig
const config = localConfig

export default config
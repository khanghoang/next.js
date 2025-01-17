import { Compiler, Plugin } from 'next/dist/compiled/webpack.js'
import { extname } from 'path'

// Prevents outputting client pages when they are not needed
export class DropClientPage implements Plugin {
  ampPages = new Set()

  apply(compiler: Compiler) {
    compiler.hooks.emit.tap('DropClientPage', compilation => {
      Object.keys(compilation.assets).forEach(assetKey => {
        const asset = compilation.assets[assetKey]

        if (
          asset &&
          asset._value &&
          asset._value.includes('__NEXT_DROP_CLIENT_FILE__')
        ) {
          const cleanAssetKey = assetKey.replace(/\\/g, '/')
          const page = '/' + cleanAssetKey.split('pages/')[1]
          const pageNoExt = page.split(extname(page))[0]

          this.ampPages.add(pageNoExt.replace(/\/index$/, '') || '/')
          delete compilation.assets[assetKey]
        }
      })
    })
  }
}

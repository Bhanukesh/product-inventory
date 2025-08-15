import type { ConfigFile } from '@rtk-query/codegen-openapi'

const config: ConfigFile = {
  schemaFile: '../PythonApi/openapi.json',
  apiFile: './src/store/api/empty-api.ts',
  apiImport: 'emptySplitApi',
  outputFiles: {
    './src/store/api/generated/products.ts': {
      filterEndpoints: [/Product/]
    },
    './src/store/api/generated/categories.ts': {
      filterEndpoints: [/Categor/]
    },
  },
  exportName: 'inventoryApi',
  hooks: true,
}

export default config
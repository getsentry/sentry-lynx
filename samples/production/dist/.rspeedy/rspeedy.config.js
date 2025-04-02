export default {
  plugins: [
    {
      name: 'lynx:rsbuild:qrcode',
      pre: [
        'lynx:rsbuild:api'
      ],
      setup: function () { /* omitted long function */ }
    },
    {
      name: 'lynx:react',
      pre: [
        'lynx:rsbuild:plugin-api'
      ],
      setup: function () { /* omitted long function */ }
    }
  ],
  output: {
    sourceMap: {
      js: 'source-map'
    },
    filename: {
      bundle: 'example.lynx.bundle',
      template: 'example.lynx.bundle'
    }
  },
  tools: {
    rspack: {
      plugins: [
        {
          apply: function () { /* omitted long function */ }
        }
      ]
    }
  }
}
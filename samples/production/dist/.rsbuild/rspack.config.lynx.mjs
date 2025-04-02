export default {
  target: [
    'es2015'
  ],
  name: 'lynx',
  devtool: false,
  context: '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production',
  mode: 'production',
  infrastructureLogging: {
    level: 'error'
  },
  watchOptions: {
    ignored: /[\\/](?:\.git|node_modules)[\\/]/,
    aggregateTimeout: 0
  },
  experiments: {
    asyncWebAssembly: true,
    layers: true
  },
  output: {
    path: '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/dist',
    filename: 'static/js/[name].[contenthash:8].js',
    chunkFilename: 'static/js/async/[name].[contenthash:8].js',
    publicPath: '/',
    pathinfo: false,
    hashFunction: 'xxhash64',
    assetModuleFilename: 'static/assets/[name].[contenthash:8][ext]',
    webassemblyModuleFilename: 'static/wasm/[hash].module.wasm',
    chunkLoading: 'require',
    chunkFormat: 'commonjs',
    iife: false
  },
  resolve: {
    tsConfig: {
      configFile: '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/tsconfig.json',
      references: 'auto'
    },
    alias: {
      '@swc/helpers': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@swc/helpers',
      '@lynx-js/react/internal$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react/runtime/lib/internal.js',
      '@lynx-js/react/legacy-react-runtime$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react/runtime/lib/legacy-react-runtime/index.js',
      '@lynx-js/react/runtime-components$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react/components/lib/index.js',
      '@lynx-js/react/worklet-runtime/bindings$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react/worklet-runtime/lib/bindings/index.js',
      react$: '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react/runtime/lib/index.js',
      '@lynx-js/react$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react/runtime/lib/index.js',
      preact$: '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/preact/dist/preact.mjs',
      'preact/compat$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/preact/compat/dist/compat.mjs',
      'preact/debug$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/preact/debug/dist/debug.mjs',
      'preact/devtools$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/preact/devtools/dist/devtools.mjs',
      'preact/hooks$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/preact/hooks/dist/hooks.mjs',
      'preact/test-utils$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/preact/test-utils/dist/testUtils.mjs',
      'preact/jsx-runtime$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs',
      'preact/jsx-dev-runtime$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs',
      'preact/compat/client$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/preact/compat/client.mjs',
      'preact/compat/server$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/preact/compat/server.mjs',
      'preact/compat/jsx-runtime$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/preact/compat/jsx-runtime.mjs',
      'preact/compat/jsx-dev-runtime$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/preact/compat/jsx-dev-runtime.mjs',
      'preact/compat/scheduler$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/preact/compat/scheduler.mjs'
    },
    extensionAlias: {
      '.js': [
        '.js',
        '.ts',
        '.tsx'
      ],
      '.jsx': [
        '.jsx',
        '.tsx'
      ]
    },
    aliasFields: [
      'browser'
    ],
    conditionNames: [
      'lynx',
      'import',
      'require',
      'browser'
    ],
    extensions: [
      '.ts',
      '.tsx',
      '.mjs',
      '.js',
      '.jsx',
      '.json',
      '.cjs'
    ],
    mainFields: [
      'lynx',
      'module',
      'main'
    ],
    mainFiles: [
      'index.lynx',
      'index'
    ]
  },
  module: {
    parser: {
      javascript: {
        exportsPresence: 'error'
      }
    },
    rules: [
      /* config.module.rule('mjs') */
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      },
      /* config.module.rule('css') */
      {
        test: /\.css$/,
        type: 'javascript/auto',
        dependency: {
          not: 'url'
        },
        sideEffects: true,
        issuerLayer: 'react:background',
        use: [
          /* config.module.rule('css').use('mini-css-extract') */
          {
            loader: '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/css-extract-webpack-plugin/lib/rspack-loader.js'
          },
          /* config.module.rule('css').use('css') */
          {
            loader: '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@rsbuild/core/compiled/css-loader/index.js',
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                namedExport: false,
                exportGlobals: false,
                exportLocalsConvention: 'camelCase',
                localIdentName: '[local]-[hash:base64:6]'
              },
              sourceMap: false
            }
          }
        ],
        resolve: {
          preferRelative: true
        }
      },
      /* config.module.rule('js') */
      {
        test: /\.(?:js|jsx|mjs|cjs|ts|tsx|mts|cts)$/,
        type: 'javascript/auto',
        dependency: {
          not: 'url'
        },
        include: [
          {
            and: [
              '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production',
              {
                not: /[\\/]node_modules[\\/]/
              }
            ]
          },
          /\.(?:ts|tsx|jsx|mts|cts)$/,
          '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react',
          /\.(?:js|mjs|cjs)$/
        ],
        oneOf: [
          /* config.module.rule('js').oneOf('react:background') */
          {
            issuerLayer: 'react:background',
            use: [
              /* config.module.rule('js').use('swc') */
              {
                loader: 'builtin:swc-loader',
                options: {
                  jsc: {
                    externalHelpers: true,
                    parser: {
                      tsx: false,
                      syntax: 'typescript',
                      decorators: true
                    },
                    experimental: {
                      cacheRoot: '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/.cache/.swc',
                      keepImportAttributes: true
                    },
                    transform: {
                      legacyDecorator: false,
                      decoratorVersion: '2022-03',
                      useDefineForClassFields: false,
                      optimizer: {
                        simplify: true
                      }
                    },
                    target: 'es2015'
                  },
                  isModule: 'unknown'
                }
              },
              /* config.module.rule('js').oneOf('react:background').use('react:background') */
              {
                loader: '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react-webpack-plugin/lib/loaders/background.js',
                options: {
                  compat: undefined,
                  enableRemoveCSSScope: true,
                  jsx: undefined,
                  isDynamicComponent: false,
                  inlineSourcesContent: true,
                  defineDCE: undefined
                }
              }
            ]
          },
          /* config.module.rule('js').oneOf('react:main-thread') */
          {
            issuerLayer: 'react:main-thread',
            use: [
              /* config.module.rule('js').oneOf('react:main-thread').use('swc') */
              {
                loader: 'builtin:swc-loader',
                options: {
                  jsc: {
                    externalHelpers: true,
                    parser: {
                      tsx: false,
                      syntax: 'typescript',
                      decorators: true
                    },
                    experimental: {
                      cacheRoot: '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/.cache/.swc',
                      keepImportAttributes: true
                    },
                    transform: {
                      legacyDecorator: false,
                      decoratorVersion: '2022-03',
                      useDefineForClassFields: false,
                      optimizer: {
                        simplify: true
                      }
                    },
                    target: 'es2019'
                  },
                  isModule: 'unknown'
                }
              },
              /* config.module.rule('js').oneOf('react:main-thread').use('react:main-thread') */
              {
                loader: '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react-webpack-plugin/lib/loaders/main-thread.js',
                options: {
                  compat: undefined,
                  enableRemoveCSSScope: true,
                  jsx: undefined,
                  inlineSourcesContent: true,
                  isDynamicComponent: false,
                  shake: undefined,
                  defineDCE: undefined
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('js-data-uri') */
      {
        mimetype: {
          or: [
            'text/javascript',
            'application/javascript'
          ]
        },
        use: [
          /* config.module.rule('js-data-uri').use('swc') */
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                externalHelpers: true,
                parser: {
                  tsx: false,
                  syntax: 'typescript',
                  decorators: true
                },
                experimental: {
                  cacheRoot: '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/.cache/.swc',
                  keepImportAttributes: true
                },
                transform: {
                  legacyDecorator: false,
                  decoratorVersion: '2022-03',
                  useDefineForClassFields: false,
                  optimizer: {
                    simplify: true
                  }
                },
                target: 'es2015'
              },
              isModule: 'unknown'
            }
          }
        ],
        resolve: {
          fullySpecified: false
        }
      },
      /* config.module.rule('image') */
      {
        test: /\.(?:png|jpg|jpeg|pjpeg|pjp|gif|bmp|webp|ico|apng|avif|tif|tiff|jfif|cur)$/i,
        oneOf: [
          /* config.module.rule('image').oneOf('image-asset-url') */
          {
            type: 'asset/resource',
            resourceQuery: /(__inline=false|url)/,
            generator: {
              filename: 'static/image/[name].[contenthash:8][ext]'
            }
          },
          /* config.module.rule('image').oneOf('image-asset-inline') */
          {
            type: 'asset/inline',
            resourceQuery: /inline/
          },
          /* config.module.rule('image').oneOf('image-asset') */
          {
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 2048
              }
            },
            generator: {
              filename: 'static/image/[name].[contenthash:8][ext]'
            }
          }
        ]
      },
      /* config.module.rule('svg') */
      {
        test: /\.svg$/i,
        oneOf: [
          /* config.module.rule('svg').oneOf('svg-asset-url') */
          {
            type: 'asset/resource',
            resourceQuery: /(__inline=false|url)/,
            generator: {
              filename: 'static/svg/[name].[contenthash:8].svg'
            }
          },
          /* config.module.rule('svg').oneOf('svg-asset-inline') */
          {
            type: 'asset/inline',
            resourceQuery: /inline/
          },
          /* config.module.rule('svg').oneOf('svg-asset') */
          {
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 2048
              }
            },
            generator: {
              filename: 'static/svg/[name].[contenthash:8].svg'
            }
          }
        ]
      },
      /* config.module.rule('media') */
      {
        test: /\.(?:mp4|webm|ogg|mov|mp3|wav|flac|aac|m4a|opus)$/i,
        oneOf: [
          /* config.module.rule('media').oneOf('media-asset-url') */
          {
            type: 'asset/resource',
            resourceQuery: /(__inline=false|url)/,
            generator: {
              filename: 'static/media/[name].[contenthash:8][ext]'
            }
          },
          /* config.module.rule('media').oneOf('media-asset-inline') */
          {
            type: 'asset/inline',
            resourceQuery: /inline/
          },
          /* config.module.rule('media').oneOf('media-asset') */
          {
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 2048
              }
            },
            generator: {
              filename: 'static/media/[name].[contenthash:8][ext]'
            }
          }
        ]
      },
      /* config.module.rule('font') */
      {
        test: /\.(?:woff|woff2|eot|ttf|otf|ttc)$/i,
        oneOf: [
          /* config.module.rule('font').oneOf('font-asset-url') */
          {
            type: 'asset/resource',
            resourceQuery: /(__inline=false|url)/,
            generator: {
              filename: 'static/font/[name].[contenthash:8][ext]'
            }
          },
          /* config.module.rule('font').oneOf('font-asset-inline') */
          {
            type: 'asset/inline',
            resourceQuery: /inline/
          },
          /* config.module.rule('font').oneOf('font-asset') */
          {
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 2048
              }
            },
            generator: {
              filename: 'static/font/[name].[contenthash:8][ext]'
            }
          }
        ]
      },
      /* config.module.rule('wasm') */
      {
        test: /\.wasm$/,
        dependency: 'url',
        type: 'asset/resource',
        generator: {
          filename: 'static/wasm/[hash].module.wasm'
        }
      },
      /* config.module.rule('react:jsx-runtime:main-thread') */
      {
        issuerLayer: 'react:main-thread',
        resolve: {
          alias: {
            'react/jsx-runtime': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react/runtime/lepus/jsx-runtime/index.js',
            'react/jsx-dev-runtime': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react/runtime/lepus/jsx-runtime/index.js',
            '@lynx-js/react/jsx-runtime': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react/runtime/lepus/jsx-runtime/index.js',
            '@lynx-js/react/jsx-dev-runtime': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react/runtime/lepus/jsx-runtime/index.js',
            '@lynx-js/react/lepus$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react/runtime/lepus/index.js',
            '@lynx-js/react/lepus/jsx-runtime': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react/runtime/lepus/jsx-runtime/index.js',
            '@lynx-js/react/lepus/jsx-dev-runtime': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react/runtime/lepus/jsx-runtime/index.js'
          }
        }
      },
      /* config.module.rule('react:jsx-runtime:background') */
      {
        issuerLayer: 'react:background',
        resolve: {
          alias: {
            'react/jsx-runtime': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react/runtime/jsx-runtime/index.js',
            'react/jsx-dev-runtime': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react/runtime/jsx-dev-runtime/index.js',
            '@lynx-js/react/jsx-runtime': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react/runtime/jsx-runtime/index.js',
            '@lynx-js/react/jsx-dev-runtime': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react/runtime/jsx-dev-runtime/index.js',
            '@lynx-js/react/lepus$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react/runtime/lib/index.js'
          }
        }
      },
      /* config.module.rule('css:react:main-thread') */
      {
        test: /\.css$/,
        type: 'javascript/auto',
        dependency: {
          not: 'url'
        },
        sideEffects: true,
        issuerLayer: 'react:main-thread',
        use: [
          /* config.module.rule('css:react:main-thread').use('ignore-css') */
          {
            loader: '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react-rsbuild-plugin/dist/loaders/ignore-css-loader'
          },
          /* config.module.rule('css:react:main-thread').use('css') */
          {
            loader: '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@rsbuild/core/compiled/css-loader/index.js',
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                namedExport: false,
                exportGlobals: false,
                exportLocalsConvention: 'camelCase',
                localIdentName: '[local]-[hash:base64:6]',
                exportOnlyLocals: true
              },
              sourceMap: false
            }
          }
        ]
      },
      /* config.module.rule('react:alias-background-only-main') */
      {
        issuerLayer: 'react:main-thread',
        resolve: {
          alias: {
            'background-only$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react-rsbuild-plugin/dist/background-only/error.js'
          }
        }
      },
      /* config.module.rule('react:alias-background-only-background') */
      {
        issuerLayer: 'react:background',
        resolve: {
          alias: {
            'background-only$': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react-rsbuild-plugin/dist/background-only/empty.js'
          }
        }
      },
      /* config.module.rule('react:detect-import-error') */
      {
        test: '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react-rsbuild-plugin/dist/background-only/error.js',
        issuerLayer: 'react:main-thread',
        use: [
          /* config.module.rule('react:detect-import-error').use('react:detect-import-error') */
          {
            loader: '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react-rsbuild-plugin/dist/loaders/invalid-import-error-loader',
            options: {
              message: '\'background-only\' cannot be imported from a main-thread module.'
            }
          }
        ]
      },
      /* config.module.rule('js-override-strict') */
      {
        type: 'javascript/auto',
        test: /\.(?:js|jsx|mjs|cjs|ts|tsx|mts|cts)$/,
        parser: {
          overrideStrict: 'strict'
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    avoidEntryIife: true,
    splitChunks: false,
    minimizer: [
      /* config.optimization.minimizer('js') */
      new SwcJsMinimizerRspackPlugin(
        {
          minimizerOptions: {
            format: {
              comments: false,
              asciiOnly: false,
              keep_quoted_props: true
            },
            compress: {
              negate_iife: false,
              join_vars: false,
              ecma: 2015,
              inline: 2,
              comparisons: false,
              toplevel: true,
              side_effects: false
            },
            mangle: {
              toplevel: true
            }
          },
          extractComments: false
        }
      ),
      /* config.optimization.minimizer('css') */
      new CssMinimizerPlugin(
        {
          minify: async function cssnanoMinify(input, sourceMap, minimizerOptions = {
            preset: "default"
          }) {
            /**
             * @template T
             * @param {string} module
             * @returns {Promise<T>}
             */
            const load = async module => {
              let exports;
              try {
                // eslint-disable-next-line import/no-dynamic-require, global-require
                exports = require(module);
                return exports;
              } catch (requireError) {
                let importESM;
                try {
                  // eslint-disable-next-line no-new-func
                  importESM = new Function("id", "return import(id);");
                } catch (e) {
                  importESM = null;
                }
                if ( /** @type {Error & {code: string}} */
                requireError.code === "ERR_REQUIRE_ESM" && importESM) {
                  exports = await importESM(module);
                  return exports.default;
                }
                throw requireError;
              }
            };
            const [[name, code]] = Object.entries(input);
            /** @type {ProcessOptions} */
            const postcssOptions = {
              from: name,
              ...minimizerOptions.processorOptions
            };
            if (typeof postcssOptions.parser === "string") {
              try {
                postcssOptions.parser = await load(postcssOptions.parser);
              } catch (error) {
                throw new Error(`Loading PostCSS "${postcssOptions.parser}" parser failed: ${
                /** @type {Error} */error.message}\n\n(@${name})`);
              }
            }
            if (typeof postcssOptions.stringifier === "string") {
              try {
                postcssOptions.stringifier = await load(postcssOptions.stringifier);
              } catch (error) {
                throw new Error(`Loading PostCSS "${postcssOptions.stringifier}" stringifier failed: ${
                /** @type {Error} */error.message}\n\n(@${name})`);
              }
            }
            if (typeof postcssOptions.syntax === "string") {
              try {
                postcssOptions.syntax = await load(postcssOptions.syntax);
              } catch (error) {
                throw new Error(`Loading PostCSS "${postcssOptions.syntax}" syntax failed: ${
                /** @type {Error} */error.message}\n\n(@${name})`);
              }
            }
            if (sourceMap) {
              postcssOptions.map = {
                annotation: false
              };
            }
          
            /** @type {Postcss} */
            // eslint-disable-next-line global-require
            const postcss = require("postcss").default;
            // @ts-ignore
            // eslint-disable-next-line global-require
            const cssnano = require("cssnano");
            // @ts-ignore
            // Types are broken
            const result = await postcss([cssnano(minimizerOptions)]).process(code, postcssOptions);
            return {
              code: result.css,
              // @ts-ignore
              map: result.map ? result.map.toJSON() :
              // eslint-disable-next-line no-undefined
              undefined,
              warnings: result.warnings().map(String)
            };
          },
          minimizerOptions: {
            preset: [
              'default',
              {
                mergeLonghand: false
              }
            ]
          }
        }
      )
    ]
  },
  plugins: [
    /* config.plugin('mini-css-extract') */
    new CssExtractRspackPlugin(
      {
        filename: '.rspeedy/[name]/[name].css',
        chunkFilename: '.rspeedy/async/[name]/[name].css',
        ignoreOrder: true,
        enableRemoveCSSScope: true,
        enableCSSSelector: true,
        targetSdkVersion: '3.2',
        cssPlugins: [
          {
            name: 'remove-function-whitespace',
            phaseStandard(root) {
                csstree.walk(root, (node) => {
                    if (node.type === 'Function' && !nameMap[node.name]) {
                        node.children.forEach((node, item, list) => {
                            if (node.type === 'WhiteSpace') {
                                list.remove(item);
                            }
                        });
                    }
                });
            }
          }
        ]
      }
    ),
    /* config.plugin('RsbuildCorePlugin') */
    {},
    /* config.plugin('define') */
    new DefinePlugin(
      {
        'import.meta.env.MODE': '"production"',
        'import.meta.env.DEV': false,
        'import.meta.env.PROD': true,
        'import.meta.env.BASE_URL': '"/"',
        'import.meta.env.ASSET_PREFIX': '""',
        'process.env.BASE_URL': '"/"',
        'process.env.ASSET_PREFIX': '""'
      }
    ),
    /* config.plugin('progress') */
    new ProgressPlugin(
      {
        prefix: 'lynx'
      }
    ),
    /* config.plugin('bundle-analyze') */
    new BundleAnalyzerPlugin(
      {
        analyzerMode: 'disabled',
        openAnalyzer: false,
        reportFilename: 'report-lynx.html',
        generateStatsFile: true
      }
    ),
    /* config.plugin('lynx:template-main') */
    new LynxTemplatePlugin(
      {
        dsl: 'react_nodiff',
        chunks: [
          'main__main-thread',
          'main'
        ],
        filename: 'example.lynx.bundle',
        intermediate: '.rspeedy/main',
        customCSSInheritanceList: undefined,
        debugInfoOutside: true,
        defaultDisplayLinear: true,
        enableA11y: true,
        enableAccessibilityElement: false,
        enableICU: false,
        enableCSSInheritance: false,
        enableCSSInvalidation: true,
        enableCSSSelector: true,
        enableNewGesture: false,
        enableParallelElement: true,
        enableRemoveCSSScope: true,
        pipelineSchedulerConfig: 65536,
        removeDescendantSelectorScope: true,
        targetSdkVersion: '3.2',
        experimental_isLazyBundle: false,
        cssPlugins: [
          {
            name: 'remove-function-whitespace',
            phaseStandard(root) {
                csstree.walk(root, (node) => {
                    if (node.type === 'Function' && !nameMap[node.name]) {
                        node.children.forEach((node, item, list) => {
                            if (node.type === 'WhiteSpace') {
                                list.remove(item);
                            }
                        });
                    }
                });
            }
          }
        ]
      }
    ),
    /* config.plugin('lynx:runtime-wrapper') */
    new RuntimeWrapperWebpackPlugin(
      {
        injectVars(vars) {
            return vars.map((name)=>{
                if ('Component' === name) return '__Component';
                return name;
            });
        },
        targetSdkVersion: '3.2',
        test: /^(?!.*main-thread(?:\.[A-Fa-f0-9]*)?\.js$).*\.js$/
      }
    ),
    /* config.plugin('LynxEncodePlugin') */
    new LynxEncodePlugin(
      {}
    ),
    /* config.plugin('lynx:react') */
    new ReactWebpackPlugin(
      {
        disableCreateSelectorQueryIncompatibleWarning: false,
        firstScreenSyncTiming: 'immediately',
        enableSSR: false,
        mainThreadChunks: [
          '.rspeedy/main/main-thread.js'
        ],
        experimental_isLazyBundle: false
      }
    ),
    /* config.plugin('lynx:chunk-loading') */
    new ChunkLoadingWebpackPlugin(),
    /* config.plugin('lynx:sourcemap') */
    new SourceMapDevToolPlugin(
      {
        filename: '[file].map[query]',
        moduleFilenameTemplate: 'file://[absolute-resource-path]',
        fallbackModuleFilenameTemplate: 'file://[absolute-resource-path]?[hash]',
        append: undefined,
        module: true,
        columns: true,
        noSources: false,
        namespace: undefined,
        publicPath: '/'
      }
    ),
    {
      apply(compiler) {
        const injected = compiler.$unpluginContext || {};
        compiler.$unpluginContext = injected;
        const meta = {
          framework: "webpack",
          webpack: {
            compiler
          }
        };
        const rawPlugins = toArray(factory(userOptions, meta));
        for (const rawPlugin of rawPlugins) {
          const plugin = Object.assign(
            rawPlugin,
            {
              __unpluginMeta: meta,
              __virtualModulePrefix: VIRTUAL_MODULE_PREFIX
            }
          );
          injected[plugin.name] = plugin;
          compiler.hooks.thisCompilation.tap(plugin.name, (compilation) => {
            compilation.hooks.childCompiler.tap(plugin.name, (childCompiler) => {
              childCompiler.$unpluginContext = injected;
            });
          });
          const externalModules = /* @__PURE__ */ new Set();
          if (plugin.transform) {
            const useLoader = [{
              loader: `${TRANSFORM_LOADER}?unpluginName=${encodeURIComponent(plugin.name)}`
            }];
            const useNone = [];
            compiler.options.module.rules.unshift({
              enforce: plugin.enforce,
              use: (data) => {
                if (data.resource == null)
                  return useNone;
                const id = normalizeAbsolutePath(data.resource + (data.resourceQuery || ""));
                if (!plugin.transformInclude || plugin.transformInclude(id))
                  return useLoader;
                return useNone;
              }
            });
          }
          if (plugin.resolveId) {
            let vfs = compiler.options.plugins.find((i2) => i2 instanceof VirtualModulesPlugin);
            if (!vfs) {
              vfs = new VirtualModulesPlugin();
              compiler.options.plugins.push(vfs);
            }
            plugin.__vfsModules = /* @__PURE__ */ new Set();
            plugin.__vfs = vfs;
            const resolverPlugin = {
              apply(resolver) {
                const target = resolver.ensureHook("resolve");
                resolver.getHook("resolve").tapAsync(plugin.name, async (request, resolveContext, callback) => {
                  if (!request.request)
                    return callback();
                  if (normalizeAbsolutePath(request.request).startsWith(plugin.__virtualModulePrefix))
                    return callback();
                  const id = normalizeAbsolutePath(request.request);
                  const requestContext = request.context;
                  const importer = requestContext.issuer !== "" ? requestContext.issuer : void 0;
                  const isEntry = requestContext.issuer === "";
                  const resolveIdResult = await plugin.resolveId(id, importer, { isEntry });
                  if (resolveIdResult == null)
                    return callback();
                  let resolved = typeof resolveIdResult === "string" ? resolveIdResult : resolveIdResult.id;
                  const isExternal = typeof resolveIdResult === "string" ? false : resolveIdResult.external === true;
                  if (isExternal)
                    externalModules.add(resolved);
                  if (!fs2.existsSync(resolved)) {
                    resolved = normalizeAbsolutePath(
                      plugin.__virtualModulePrefix + encodeURIComponent(resolved)
                    );
                    if (!plugin.__vfsModules.has(resolved)) {
                      plugin.__vfs.writeModule(resolved, "");
                      plugin.__vfsModules.add(resolved);
                    }
                  }
                  const newRequest = {
                    ...request,
                    request: resolved
                  };
                  resolver.doResolve(target, newRequest, null, resolveContext, callback);
                });
              }
            };
            compiler.options.resolve.plugins = compiler.options.resolve.plugins || [];
            compiler.options.resolve.plugins.push(resolverPlugin);
          }
          if (plugin.load) {
            compiler.options.module.rules.unshift({
              include(id) {
                if (id.startsWith(plugin.__virtualModulePrefix))
                  id = decodeURIComponent(id.slice(plugin.__virtualModulePrefix.length));
                if (plugin.loadInclude && !plugin.loadInclude(id))
                  return false;
                return !externalModules.has(id);
              },
              enforce: plugin.enforce,
              use: [{
                loader: LOAD_LOADER,
                options: {
                  unpluginName: plugin.name
                }
              }]
            });
          }
          if (plugin.webpack)
            plugin.webpack(compiler);
          if (plugin.watchChange || plugin.buildStart) {
            compiler.hooks.make.tapPromise(plugin.name, async (compilation) => {
              const context = createContext(compilation);
              if (plugin.watchChange && (compiler.modifiedFiles || compiler.removedFiles)) {
                const promises = [];
                if (compiler.modifiedFiles) {
                  compiler.modifiedFiles.forEach(
                    (file) => promises.push(Promise.resolve(plugin.watchChange.call(context, file, { event: "update" })))
                  );
                }
                if (compiler.removedFiles) {
                  compiler.removedFiles.forEach(
                    (file) => promises.push(Promise.resolve(plugin.watchChange.call(context, file, { event: "delete" })))
                  );
                }
                await Promise.all(promises);
              }
              if (plugin.buildStart)
                return await plugin.buildStart.call(context);
            });
          }
          if (plugin.buildEnd) {
            compiler.hooks.emit.tapPromise(plugin.name, async (compilation) => {
              await plugin.buildEnd.call(createContext(compilation));
            });
          }
          if (plugin.writeBundle) {
            compiler.hooks.afterEmit.tap(plugin.name, () => {
              plugin.writeBundle();
            });
          }
        }
      }
    }
  ],
  performance: {
    hints: false,
    maxAssetSize: 250000,
    maxEntrypointSize: 250000
  },
  entry: {
    'main__main-thread': {
      layer: 'react:main-thread',
      'import': [
        './src/index.js'
      ],
      filename: '.rspeedy/main/main-thread.js'
    },
    main: {
      layer: 'react:background',
      'import': [
        './src/index.js'
      ],
      filename: '.rspeedy/main/background.[contenthash:8].js'
    }
  }
}
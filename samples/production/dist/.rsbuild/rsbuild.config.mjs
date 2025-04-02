export default {
  html: {
    meta: {
      charset: {
        charset: 'UTF-8'
      },
      viewport: 'width=device-width, initial-scale=1.0'
    },
    title: 'Rsbuild App',
    inject: 'head',
    mountId: 'root',
    crossorigin: false,
    outputStructure: 'flat',
    scriptLoading: 'defer'
  },
  resolve: {
    alias: {
      '@swc/helpers': '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@swc/helpers'
    },
    aliasStrategy: 'prefer-tsconfig',
    extensions: [
      '.ts',
      '.tsx',
      '.mjs',
      '.js',
      '.jsx',
      '.json'
    ]
  },
  source: {
    alias: {},
    define: {},
    preEntry: [],
    decorators: {
      version: '2022-03'
    },
    assetsInclude: undefined,
    entry: {
      main: './src/index.js'
    },
    exclude: undefined,
    include: [
      '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/node_modules/@lynx-js/react',
      /\.(?:js|mjs|cjs)$/
    ],
    transformImport: undefined,
    tsconfigPath: '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production/tsconfig.json'
  },
  output: {
    target: 'web',
    cleanDistPath: 'auto',
    distPath: {
      root: 'dist',
      css: '.rspeedy',
      svg: 'static/svg',
      font: 'static/font',
      html: './',
      wasm: 'static/wasm',
      image: 'static/image',
      media: 'static/media',
      assets: 'static/assets',
      js: 'static/js'
    },
    assetPrefix: '/',
    filename: {
      css: '[name]/[name].css',
      bundle: 'example.lynx.bundle',
      template: 'example.lynx.bundle'
    },
    charset: 'utf8',
    polyfill: 'off',
    dataUriLimit: 2048,
    legalComments: 'none',
    injectStyles: false,
    minify: {
      js: true,
      jsOptions: {
        minimizerOptions: {
          compress: {
            negate_iife: false,
            join_vars: false,
            ecma: 2015,
            inline: 2,
            comparisons: false,
            toplevel: true,
            side_effects: false
          },
          format: {
            keep_quoted_props: true,
            comments: false
          },
          mangle: {
            toplevel: true
          }
        }
      },
      css: true,
      cssOptions: {
        minimizerOptions: {
          targets: '',
          include: {
            nesting: true,
            doublePositionGradients: true,
            spaceSeparatedColorNotation: true
          },
          exclude: {
            vendorPrefixes: true,
            logicalProperties: true,
            hexAlphaColors: true
          }
        }
      }
    },
    manifest: false,
    sourceMap: {
      js: 'source-map',
      css: false
    },
    filenameHash: true,
    inlineScripts: false,
    inlineStyles: false,
    cssModules: {
      auto: true,
      namedExport: false,
      exportGlobals: false,
      exportLocalsConvention: 'camelCase'
    },
    emitAssets: true,
    copy: undefined
  },
  tools: {
    cssExtract: {
      loaderOptions: {},
      pluginOptions: {
        ignoreOrder: true
      }
    },
    bundlerChain: undefined,
    cssLoader: undefined,
    htmlPlugin: false,
    rspack: {
      plugins: [
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
      ]
    },
    swc: [
      function swc (config) {
          config.jsc ??= {};
          config.jsc.transform ??= {};
          config.jsc.transform.useDefineForClassFields = false;
          config.jsc.transform.optimizer ??= {};
          config.jsc.transform.optimizer.simplify = true;
          config.jsc.parser ??= {
              syntax: "typescript"
          };
          if ("typescript" === config.jsc.parser.syntax) {
              config.jsc.parser.tsx = false;
              config.jsc.parser.decorators = true;
          }
          return config;
      },
      function swc(config) {
          delete config.env;
          config.jsc ??= {};
          // TODO(target): use configuration
          config.jsc.target = getESVersionTarget();
      }
    ]
  },
  security: {
    nonce: '',
    sri: {
      enable: false
    }
  },
  performance: {
    profile: false,
    printFileSize: true,
    removeConsole: false,
    removeMomentLocale: false,
    chunkSplit: {
      strategy: 'all-in-one'
    },
    bundleAnalyze: {
      analyzerMode: 'disabled',
      generateStatsFile: true
    }
  },
  mode: 'production',
  plugins: [
    {
      name: 'rsbuild:basic',
      setup() {}
    },
    {
      name: 'rsbuild:entry',
      setup() {}
    },
    {
      name: 'rsbuild:cache',
      setup() {}
    },
    {
      name: 'rsbuild:target',
      setup() {}
    },
    {
      name: 'rsbuild:output',
      setup() {}
    },
    {
      name: 'rsbuild:resolve',
      setup() {}
    },
    {
      name: 'rsbuild:file-size',
      setup() {}
    },
    {
      name: 'rsbuild:clean-output',
      setup() {}
    },
    {
      name: 'rsbuild:asset',
      setup() {}
    },
    {
      name: 'rsbuild:html',
      setup() {}
    },
    {
      name: 'rsbuild:app-icon',
      setup() {}
    },
    {
      name: 'rsbuild:wasm',
      setup() {}
    },
    {
      name: 'rsbuild:moment',
      setup() {}
    },
    {
      name: 'rsbuild:node-addons',
      setup() {}
    },
    {
      name: 'rsbuild:define',
      setup() {}
    },
    {
      name: 'rsbuild:css',
      setup() {}
    },
    {
      name: 'rsbuild:minimize',
      setup() {}
    },
    {
      name: 'rsbuild:progress',
      setup() {}
    },
    {
      name: 'rsbuild:swc',
      setup() {}
    },
    {
      name: 'rsbuild:externals',
      setup() {}
    },
    {
      name: 'rsbuild:split-chunks',
      setup() {}
    },
    {
      name: 'rsbuild:inline-chunk',
      setup() {}
    },
    {
      name: 'rsbuild:rsdoctor',
      setup() {}
    },
    {
      name: 'rsbuild:resource-hints',
      setup() {}
    },
    {
      name: 'rsbuild:performance',
      setup() {}
    },
    {
      name: 'rsbuild:bundle-analyzer',
      setup() {}
    },
    {
      name: 'rsbuild:server',
      setup() {}
    },
    {
      name: 'rsbuild:manifest',
      setup() {}
    },
    {
      name: 'rsbuild:module-federation',
      setup() {}
    },
    {
      name: 'rsbuild:rspack-profile',
      setup() {}
    },
    {
      name: 'rsbuild:lazy-compilation',
      setup() {}
    },
    {
      name: 'rsbuild:sri',
      setup() {}
    },
    {
      name: 'rsbuild:nonce',
      setup() {}
    },
    {
      name: 'lynx:rsbuild:qrcode',
      pre: [
        'lynx:rsbuild:api'
      ],
      setup() {}
    },
    {
      name: 'lynx:react',
      pre: [
        'lynx:rsbuild:plugin-api'
      ],
      setup() {}
    },
    {
      name: 'lynx:rsbuild:inspect',
      setup() {}
    },
    {
      name: 'lynx:rsbuild:stats',
      setup() {}
    },
    {
      name: 'lynx:rsbuild:plugin-api',
      setup() {}
    },
    {
      name: 'lynx:rsbuild:chunk-loading',
      setup() {}
    },
    {
      name: 'lynx:rsbuild:minify',
      setup() {}
    },
    {
      name: 'lynx:rsbuild:optimization',
      setup() {}
    },
    {
      name: 'lynx:rsbuild:output',
      setup() {}
    },
    {
      name: 'lynx:rsbuild:resolve',
      setup() {}
    },
    {
      name: 'lynx:rsbuild:rsdoctor',
      remove: [
        'rsbuild:rsdoctor'
      ],
      setup() {}
    },
    {
      name: 'lynx:rsbuild:sourcemap',
      pre: [
        'lynx:rsbuild:dev'
      ],
      setup() {}
    },
    {
      name: 'lynx:rsbuild:swc',
      setup() {}
    },
    {
      name: 'lynx:rsbuild:target',
      setup() {}
    },
    {
      name: 'rsbuild:css-minimizer',
      setup() {}
    }
  ],
  root: '/Users/giancarlobuenaflor/Desktop/SentryProjects/sentry-lynx/samples/production',
  dev: {
    writeToDisk: true,
    hmr: true,
    assetPrefix: '/',
    liveReload: true,
    cliShortcuts: false,
    client: {
      path: '/rsbuild-hmr',
      port: '',
      host: '',
      overlay: true,
      reconnect: 100
    },
    watchFiles: undefined
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false,
    base: '/',
    htmlFallback: 'index',
    compress: true,
    printUrls: false,
    strictPort: false,
    cors: false,
    middlewareMode: false,
    headers: undefined
  }
}
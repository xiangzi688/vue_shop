// 项目发布阶段需要用到的bable 插件
const prodPlugins = []
if (process.env.NODE_EV === 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    ...prodPlugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}

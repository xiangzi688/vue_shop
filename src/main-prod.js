import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import './assets/css/global.css'
// 导入 日期格式化 工具
import moment from 'moment'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入树形表格
import treeTable from 'vue-table-with-tree-grid'

// 导入网络请求配置
import http from './request/index.js'
Vue.prototype.$http = http

Vue.component('tree-table', treeTable)
Vue.use(VueQuillEditor)

// 全局日期过滤器
Vue.filter('dateformat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

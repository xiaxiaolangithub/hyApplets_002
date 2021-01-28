import Vue from 'vue'
import App from './App'
import '@/static/css/index.scss'				// 引入所有页面的样式集合
import '@/static/css/iconfont/iconfont.css'

import http from '@/utils/https.js';			// ajax封装、vuex
import apis from '@/utils/interfaces.js';
Vue.prototype.$http = http;
Vue.prototype.$apis = apis;
//配置公共方法
import { noMultipleClicks } from '@/static/js/tool.js' // VUE防止按钮重复点击
Vue.prototype.$noMultipleClicks = noMultipleClicks;  
Vue.config.productionTip = false
import store from './store'
Vue.prototype.$store = store


import hxNavbar from "@/components/hx-navbar/hx-navbar.vue" 	// 自定义头部导航栏
Vue.component('hx-navbar',hxNavbar)


import {realmImg, realmImgTwo} from '@/static/js/tool.js'					// 引用服务器图片封装
Vue.prototype.realmImg = realmImg;
Vue.prototype.realmImgTwo = realmImgTwo;

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()

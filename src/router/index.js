import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AppView from '../views/AppView.vue'
import EditorView from '../views/EditorView.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/app',
    name: 'App',
    component: AppView,
    children: [
      {
        path: '',
        name: 'Editor',
        component: EditorView
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

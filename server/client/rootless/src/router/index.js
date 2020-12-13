import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: "/app/"
  },
  {
    name: "appDashboard",
    path: "/app/",

    children: [
      {
        name: "Dashboard",
        path: "/app/home",
        component: require("../views/Home.vue").default
      },
      {
        name: "Create",
        path: "/app/create",
        component: require("../views/create.vue").default
      },
      {
        name: "Server",
        path: "/app/server",
        component: require("../views/server.vue").default
      },
      {
        name: "Storage",
        path: "/app/storage",
        component: require("../views/storage.vue").default
      },
      {
        name: "NewCollection",
        path: "/app/new/collection",
        component: require("../views/newcollection.vue").default
      },
      {
        name: "Collection",
        path: "/app/collection/:slug",
        component: require("../views/collection.vue").default
      },

    ],
    component: require("../views/dashboard.vue").default,
    redirect: "/app/home"
  },
  {
    name: "appAuth",
    path: "/auth/",

    children: [
      {
        name: "Register",
        path: "/auth/home",
        component: require("../views/Home.vue").default
      },
      {
        name: "Login",
        path: "/auth/create",
        component: require("../views/create.vue").default
      }

    ],
    component: require("../views/auth.vue").default,
    redirect: "/auth/home"
  }
]

const router = new VueRouter({
  routes
})

export default router

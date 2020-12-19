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
        name: "Overview",
        path: "/app/overview",
        component: require("../views/overview.vue").default
      },
      {
        name: "Create",
        path: "/app/create",
        component: require("../views/create.vue").default
      },
      {
        name: "Logs",
        path: "/app/logs",
        component: require("../views/logs.vue").default
      },
      {
        name: "Settings",
        path: "/app/settings",
        component: require("../views/settings.vue").default
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
    redirect: "/app/overview"
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

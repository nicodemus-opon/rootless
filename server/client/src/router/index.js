import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { store } from "@/store";
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
    meta: {
      requiresAuth: true
    },
    component: require("../views/dashboard.vue").default,
    redirect: "/app/overview"
  },
  {
    name: "appAuth",
    path: "/auth/",

    children: [
      {
        name: "Register",
        path: "/auth/login",
        component: require("../views/auth-login.vue").default
      },
      {
        name: "Login",
        path: "/auth/register",
        component: require("../views/create.vue").default
      }

    ],
    component: require("../views/auth.vue").default,
    redirect: "/auth/login"
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.

    //Nprogress.start();
    const loggedin = store.getters.isLoggedIn;
    console.log(loggedin);
    if (!store.getters.isLoggedIn) {
      next({ path: "/auth/login" });
    } else {
      next(); // go to wherever I'm going
    }
  } else {
    next(); // does not require auth, make sure to always call next()!
  }
});
router.afterEach((to, from) => {
  // ...
  console.log(to.path);
  console.log(from.path);
  // Nprogress.done();
});
export default router

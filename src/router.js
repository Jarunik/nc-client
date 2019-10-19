import Vue from "vue";
import Router from "vue-router";
import account from "./views/Account.vue";
import NotFound from "./views/NotFound.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    //Direct possibility to call /404 without retaining path due to alias
    { path: "/404", alias: "*", component: NotFound },
    //404 as catchall because history mode forwards to index.html in nginx
    { path: "*", redirect: "/404" },
    {
      path: "/",
      name: "/account",
      component: account,
      props: route => ({
        // pass steemconnect query values as props
        callbackAccessToken: route.query.access_token,
        callbackExpiresIn: route.query.expires_in,
        callbackUserName: route.query.username
      })
    },
    {
      path: "/season",
      name: "season",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "season" */ "./views/Season.vue")
    },
    {
      path: "/ranking",
      name: "ranking",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "ranking" */ "./views/Ranking.vue")
    },
    {
      path: "/activity",
      name: "activity",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "activity" */ "./views/Activity.vue")
    },
    {
      path: "/battlefeed",
      name: "battlefeed",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "battlefeed" */ "./views/BattleFeed.vue")
    },
    {
      path: "/shop",
      name: "shop",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "shop" */ "./views/Shop.vue")
    },
    {
      path: "/battle/:missionId",
      name: "battle",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "battle" */ "./views/Battle.vue"),
      props: true
    },
    {
      path: "/simulator",
      name: "simulator",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "simulator" */ "./views/Simulator.vue"),
      props: true
    },
    {
      path: "/skills",
      name: "skills",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "skills" */ "./views/Skills.vue"),
      props: true
    },
    {
      path: "/missions",
      name: "missions",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "missions" */ "./views/Missions.vue"),
      props: true
    },
    {
      path: "/items",
      name: "items",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "items" */ "./views/Items.vue"),
      props: true
    },
    {
      path: "/planets",
      name: "planets",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "planets" */ "./views/Planets.vue"),
      props: true
    },
    {
      path: "/buildings",
      name: "buildings",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "buildings" */ "./views/Buildings.vue"),
      props: true
    },
    {
      path: "/shipyard",
      name: "shipyard",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "shipyard" */ "./views/Shipyard.vue"),
      props: true
    },
    {
      path: "/galaxy",
      name: "galaxy",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "galaxy" */ "./views/Galaxy.vue"),
      props: true
    },
    {
      path: "/production",
      name: "production",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "production" */ "./views/Production.vue"),
      props: true
    },
    {
      path: "/fleet",
      name: "fleet",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "fleet" */ "./views/Fleet.vue"),
      props: true
    },
    {
      path: "/wallet",
      name: "wallet",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "wallet" */ "./views/Wallet.vue")
    },
    {
      path: "/administration",
      name: "administration",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "administration" */ "./views/Administration.vue")
    },
    {
      path: "/maps",
      name: "maps",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "maps" */ "./views/Maps.vue")
    }
  ]
});

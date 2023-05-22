Vue.use(VueRouter);
// Vue.use(VeeValidate);

const routes = [
  {
    path: "/class",
    component: httpVueLoader("./page/class.vue"),
  },
  {
    path: "*",
    component: httpVueLoader("./page/notFound.vue"),
  },
];

let router = new VueRouter({
  base: "/heapp",
  mode: "hash",
  routes: routes, // short for `routes: routes`
});

router.beforeEach(function (to, from, next) {
  console.log(to, from);
  next();
});

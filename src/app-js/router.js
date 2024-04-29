import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: () => import("@/layout/AuthLayout.vue"),

        children: [
            {
                path: '',
                name: 'landingPage',
                meta: { requiresAuth: false, title: "Login", show_back_btn: false },
                component: () => import("@/views/LandingPage.vue"),
            },
            // {
            //     beforeEnter: (to, from, next) => {
            //         guard(to, from, next)
            //     },
            //     path: 'register',
            //     name: 'register',
            //     meta: { requiresAuth: true, title: "register", show_back_btn: false },
            //     component: () => import('@/views/auth/register/addProfile.vue')
            // },

        ]
    },
    {
        path: '/',
        name: 'home',
        component: () => import("@/layout/Base.vue"),
        // beforeEnter: (to, from, next) => {
        //     guard(to, from, next)
        // },
        // children: [
        //     {
        //         path: '/document',
        //         name: 'document',
        //         meta: { requiresAuth: true, title: "document" },
        //         component: () => import('@/views/UploadDocuments.vue')
        //     },
        //     {
        //         path: '/add-user',
        //         name: 'add-user',
        //         meta: { requiresAuth: true, title: "Add User" },
        //         component: () => import('@/views/userCreation.vue')
        //     },
        // ]
    }
];

// const guard = function () {
// if (localStorage.getItem('token')) {
//     next()
// }
// else if ((localStorage.getItem('token') == "") && next('/')) {
//     next('/')
// }

// else {
//     next('/')
// }
// }

const router = new VueRouter({
    routes,
    mode: 'history',
})

export default router
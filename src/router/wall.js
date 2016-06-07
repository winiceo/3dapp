export default function(router) {
    router.map({
        '/': {
            name: 'home',
            component: require('../components/Wall/Index.vue')
        },
        '/login': {
            name: 'login',
            component: require('../components/User/Login.vue')
        },
        '/register': {
            name: 'register',
            component: require('../components/User/Register.vue')
        },
        '/new_activity': {
            name: 'activity',
            component: require('../components/Wall/Newactivity.vue')
        },

        '*': {
            component: require('../components/NotFound.vue')
        }
    })

}

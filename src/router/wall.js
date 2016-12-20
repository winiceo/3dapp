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
        '/new_pay_activity': {
            name: 'activity',
            component: require('../components/Wall/Newpayactivity.vue')
        },
        '/setting': {
            name: 'setting',
            component: require('../components/Wall/Setting.vue')
        },
        '/setting2': {
            name: 'setting2',
            component: require('../components/Wall/Setting2.vue')
        },

        '/usercenter': {
            name: 'usercenter',
            component: require('../components/Wall/Usercenter.vue')
        },

        '*': {
            component: require('../components/Common/NotFound.vue')
        }
    })

}

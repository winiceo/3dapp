export default function(router) {
    router.map({
        '/': {
            name: 'home',
            component: require('../components/Static/Activity.vue')
        },
        '/poll': {
            name: 'poll',
            component: require('../components/Static/Poll.vue')
        },
        
        '/lottery': {
            name: 'lottery',
            component: require('../components/Static/Lottery.vue')
        },
        
        '*': {
            component: require('../components/Common/NotFound.vue')
        }
    })

}

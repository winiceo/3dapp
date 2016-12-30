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
        '/shakeprize': {
            name: 'shakeprize',
            component: require('../components/Static/Shakeprize.vue')
        },
        '/shake': {
            name: 'shake',
            component: require('../components/Static/Shake.vue')
        },
        '/zjd': {
            name: 'zjd',
            component: require('../components/Static/Zjd.vue')
        },
        
        '*': {
            component: require('../components/Common/NotFound.vue')
        }
    })

}

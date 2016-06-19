export default function(router) {
    router.map({
        '/': {
            name: 'home',
            component: require('../components/Logo/Index.vue')
        }

    })

}

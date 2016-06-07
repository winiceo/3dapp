export default function(router) {
    router.map({
        '/': {
            name: 'home',
            component: require('../components/Setting.vue')
        },
        // '/login': {
        //   name: 'login',
        //   component: require('../components/Login/index.vue')
        // },


        '/media': {
            name: 'media',
            component: require('../components/Media.vue')
        },
        '/danmu': {
            name: 'danmu',
            component: require('../components/Danmu.vue')
        },

        '/vipwall': {
            name: 'vipwall',
            component: require('../components/Vipwall.vue')
        },


        '/picwall': {
            name: 'picwall',
            component: require('../components/Picwall.vue')
        },


        '/lottery': {
            name: 'lottery',
            component: require('../components/Lottery.vue')
        },

        '/poll': {
            name: 'poll',
            component: require('../components/Poll.vue')
        },
        '/message': {
            name: 'message',
            component: require('../components/Message.vue')
        },





        // '/article/:aid':{
        //   name: 'article',
        //   component: require('../components/Article/index.vue')
        // },
        // '/apps': {
        //   name: 'apps',
        //   component: require('../components/Apps/index.vue')
        // },
        '*': {
            component: require('../components/NotFound.vue')
        }
    })

}

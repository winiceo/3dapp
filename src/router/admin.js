export default function(router) {
    router.map({
        '/': {
            name: 'home',
            component: require('../components/Admin/Setting.vue')
        },
        '/danmu': {
            name: 'danmu',
            component: require('../components/Admin/Danmu.vue')
        },

        '/sign': {
            name: 'sign',
            component: require('../components/Admin/Sign.vue')
        },

        '/logo': {
            name: 'logo',
            component: require('../components/Logo/Index.vue')
        },
        // '/media': {
        //     name: 'media',
        //     component: require('../components/Admin/Media.vue')
        // },
        
        '/vipwall': {
            name: 'vipwall',
            component: require('../components/Admin/Vipwall.vue')
        },
         
        '/picwall': {
            name: 'picwall',
            component: require('../components/Admin/Picwall.vue')
        },
        //
        //
        '/lottery': {
            name: 'lottery',
            component: require('../components/Admin/Lottery.vue')
        },
        //
        '/poll': {
            name: 'poll',
            component: require('../components/Admin/Poll.vue')
        },
        '/shake': {
            name: 'shake',
            component: require('../components/Admin/Shake.vue')
        },
        '/shakeprize': {
            name: 'shakeprize',
            component: require('../components/Admin/Shakeprize.vue')
        },
        '/shakeluckymoneywall': {
            name: 'shakeluckymoneywall',
            component: require('../components/Admin/Shakeluckymoneywall.vue')
        },
        '/zjd': {
            name: 'zjd',
            component: require('../components/Admin/Zjdwall.vue')
        },


        // '/message': {
        //     name: 'message',
        //     component: require('../components/Admin/Tt.vue')
        // },
        // '/message': {
        //     name: 'message',
        //     component: require('../components/Admin/Message.vue')
        // },





        // '/article/:aid':{
        //   name: 'article',
        //   component: require('../components/Admin/Article/index.vue')
        // },
        // '/apps': {
        //   name: 'apps',
        //   component: require('../components/Admin/Apps/index.vue')
        // },
        '*': {
            component: require('../components/Common/NotFound.vue')
        }
    })

}

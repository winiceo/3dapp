/**
 * Created by leven on 16/6/7.
 */
var localForage = require('localforage')

function VueDb(Vue) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1]



    Vue.prototype.$getItem = function (key, callback) {
       return localForage.getItem(key, callback)
    }

    Vue.prototype.$setItem = function (key, value, callback) {
      return  localForage.setItem(key, value, callback)
    }

    Vue.prototype.$removeItem = function (key, callback) {
       return localForage.removeItem(key, callback)
    }

    Vue.prototype.$clearStorage = function () {
       return localForage.clear()
    }

    Vue.prototype.$lengthOfStorage = function () {
        localForage.length()
    }

    Vue.prototype.$keyInStorage = function (keyIndex, callback) {
        localForage.key(keyIndex, callback)
    }

    Vue.prototype.$keysInStorage = function (callback) {
        localForage.keys(callback)
    }

    Vue.prototype.$iterateStorage = function (iteratorCallback, callback) {
        localForage.iterate(iteratorCallback, callback)
    }

    Vue.prototype.$setStorageDriver = function (driverName) {
        localForage.setDriver(driverName)
    }

    Vue.prototype.$storageConfig = function (options) {
        localForage.config(options)
    }

}

VueDb.version = '0.2.0'

module.exports = VueDb
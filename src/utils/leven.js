/**
 * Created by leven on 16/6/7.
 */
import {User_Center} from '../config.js'

exports.req = function (param) {
    var urlParams;
    (window.onpopstate = function () {
        var match,
            pl = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) {
                return decodeURIComponent(s.replace(pl, " "));
            },
            query = window.location.search.substring(1);

        urlParams = {};
        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);
    })();
    return urlParams[param]
}

exports.whatever = function (callback) {
    return callback&&
        callback.constructor === Function
        &&
        callback()
         
}
//检测状态码
exports.checkStatus = function (response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    }else if(response.status == 401){
        window.location.href=User_Center+"/login"
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
        window.location.href=User_Center+"/login"
    }

}
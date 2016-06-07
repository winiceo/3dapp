/**
 * Created by leven on 16/6/7.
 */


import localforage from "localforage"
localforage.config({
    driver      : localforage.WEBSQL, // Force WebSQL; same as using setDriver()
   
    version     : 1.0,
    size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName   : 'keyvaluepairs', // Should be alphanumeric, with underscores.
    description : '快屏api'
});

var db = localforage.createInstance({
    name        : 'kpApp',
});

export default db
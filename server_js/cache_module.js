var ShortMemory = require('short-memory');


var options = {
    // How long, in seconds, it takes for an entry to expire and become
    // prunable. Defaults to 0, which does not set expirations for
    // entries. This can be over-ridden by the options passed when
    // setting a cache entry.
    maxAge: 600,

    // How large the (estimated*) size of the cache can be before
    // pruning old entries. Defaults to 0, which does not set a
    // maximum size.
    maxSize: 500000000,
    // * Size estimations are best-guess. This method should be
    // last resort, perhaps used as a fail-safe against enormous
    // data retention.

    // How many entries the cache can hold before pruning the
    // oldest entries. Defaults to 0, which allows any number of
    // entries.
    maxCount: 100,

    // How often the system checks for and destroys obsolete
    // entries, in seconds. Defaults to 5.
    pruneTime: 50,


    // When an entry is this many seconds from expiring, the
    // system should return the current value on request and kick
    // off a process to update the value afterwards. This is used
    // by the getOrSet function. This can be over-ridden by the
    // options passed when setting a cache entry.
    deathTime: 0,

    // Writes verbose output to the console for debugging.
    debug: false

};

var excache = new ShortMemory(options);

module.exports = excache;
/*
 * @Author: zhaoye 
 * @Date: 2017-04-17 16:42:16 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-10-16 11:26:49
 */
const crypto = require('crypto')
const fs     = require('fs')
/**
 * 
 */
class CacheFile {
    /**
     * 
     * @param {*} filepath 
     */
    constructor (filepath) {
        this.filepath = filepath
        this.payload = ''
        this.initSig()
    }
    /**
     * 
     */
    initSig () {
        const contents = String(fs.readFileSync(this.filepath))
        this.signature = crypto.createHash('md5').update(contents).digest('hex')
    }
    /**
     * 
     */
    tryChangeSig () {
        const contents = String(fs.readFileSync(this.filepath))
        const signature = crypto.createHash('md5').update(contents).digest('hex')

        if (signature != this.signature) {
            this.signature = signature
            return true
        }
        return false

    }
}

module.exports = CacheFile
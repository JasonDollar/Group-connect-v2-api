const Hashids = require('hashids/cjs')

const hashids = new Hashids(process.env.HASH_ID_SALT)

const encodeHashId = ObjectId => hashids.encodeHex(ObjectId + '')
const decodeHashId = hashId => hashids.decodeHex(hashId)

module.exports = {
  encodeHashId,
  decodeHashId,
}
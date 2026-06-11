// test-hash.js
require('dotenv').config()
const sha256 = require('js-sha256')
const { User } = require('./models/user_model')
const mongoose = require('mongoose')

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    const user = await User.findOne({ email: 'alice@example.com' })
    console.log('SALT utilisé      :', JSON.stringify(process.env.SALT))
    console.log('Hash calculé      :', sha256('motdepasse123' + process.env.SALT))
    console.log('Hash stocké (BDD) :', user.password)
    console.log('Identiques ?      :', sha256('motdepasse123' + process.env.SALT) === user.password)
    await mongoose.disconnect()
}
run()
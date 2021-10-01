const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  currency: String,
  // topCoins: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Coin'
  // }],
  topCoins: [String]

})

userSchema.virtual('monedas', {
  ref: 'Coin',
  localField: 'topCoins',
  foreignField: 'id',
  justOne: false
})

userSchema.set('toJSON',
  {
    virtuals: true,
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id
      returnedObject.topCoins = returnedObject.monedas
      delete returnedObject.monedas
      delete returnedObject._id
      delete returnedObject.__v

      delete returnedObject.password
    }
  })

const User = model('User', userSchema)

module.exports = User

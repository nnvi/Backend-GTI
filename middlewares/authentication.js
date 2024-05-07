const {users} = require("../models")
const { verifyToken } = require("../helpers/jwt")

const authentication = async (req, res, next) => {
  try {
    // cheack header, ada access token?
    const { token } = req.headers

    if (!token) {
      throw {
        code: 401,
        message: "Token not provided!"
      }
    }

    // verify token
    const decode = verifyToken(token)

    const user = await users.findOne({
      where: {
        id: decode.id,
        email: decode.email
      }
    })
    if (!user) {
      throw{
        code: 401,
        message: "User not found"
      }
    }

    req.UserData = {
      id: user.id,
      email: user.email,
      username: user.username
    }

    next()
  } catch (error) {
    res.status(error?.code || 500).json(error)
  }
}

module.exports = authentication
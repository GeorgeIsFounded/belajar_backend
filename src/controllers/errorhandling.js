const errorHandling = (err, req, res, next) => {
    res.status(500).json({
        status: "error",
        message: "There's problem with server"
    })
}

module.exports = errorHandling
const notFound = (req, res, next) => {
    res.status(404).json({
        status: "error",
        message: "Page not Found :("
    })
}

module.exports = notFound
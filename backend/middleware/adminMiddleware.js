const adminMiddleware = (req, res, next) => {
    if(req.user.role !== "admin"){
        return res.json({success: false, message:"Access denied admin only"})
    }
    next()
}
module.exports = adminMiddleware
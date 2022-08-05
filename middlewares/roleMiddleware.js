module.exports = (roles) => {
    return (req, res, next) => {
        const userRole = req.body.role

        if(roles.includes(userRole)) next()
            next()
        return res.status(401).send('You cant do it')
    }
}
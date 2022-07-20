const router = require('express').Router();

router.get('/dashboard' , async(req, res , next) => {
    try {
        res.render("dashboard");
    } catch (error) {
        next(error)
    }
})


module.exports = router;
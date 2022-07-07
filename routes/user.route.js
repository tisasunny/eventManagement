const router = require('express').Router();
router.get(
    '/eventr',    async (req, res, next) => {
      try{
          res.render("eventr");
      }catch(err){
          next(err);
      }
    }
  );
  
module.exports = router;
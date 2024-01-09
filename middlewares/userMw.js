module.exports.redirectUrl = (req,res,next)=>{
    //here we are storing session's redirect url to res.locals
    //because passport automatically reset the session and delete its variables
    //after authenticating so redirect url will get deleted and will not be accessible
    //so just before authentication process we passed a m.w to store it in res.locals
    res.locals.redirectUrl = req.session.redirectUrl;
    next();
}
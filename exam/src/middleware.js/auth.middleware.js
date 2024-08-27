import jwt from 'jsonwebtoken'
import User from '../../DB/moduls/user.model.js'

export const auth = (accesRoles)=>{
    return async (req,res,next) => {
        try {
            const { accesstoken } = req.headers
        if(!accesstoken) {
            return next (new Error('please login first', {cause: 400}))
        }
        if (!accesstoken.startsWith(process.env.TOKEN_PREFIX)) {
            return next(new Error("invalid acces token"), { cause: 400 });
        }
        const token = accesstoken.split(process.env.TOKEN_PREFIX)[1];
        // console.log(token)

        const dedecode = jwt.verify(token, process.env.LOGUN_SIGNATURE);
        // console.log(dedecode)

        if(!dedecode || !dedecode.id) return next(new Error("please sign up first", { cause: 404 }));

        // user check in data base 

        const findUser = await User.findById(dedecode.id, 'email username password role')  //controle in data of user
        if(!findUser){
            return next(new Error ('please sign up first', {cause: 404}))
        }
        

        // authrization 
        if(!accesRoles.includes(findUser.role)) return next(new Error('you  are not authoraized', { cause: 401 }))




        // sending to apis
        req.authUser = findUser
        next()


        } catch (error) {
                console.error("Error in auth middleware:", error);
            return next(new Error("catch in middle auth error", { cause: 500 }, error));
        }
    }
}













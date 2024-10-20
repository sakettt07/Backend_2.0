import {redis} from "../index.js"
export const getCachedData = (key)=>async(req,res,next)=>{
    let data =await redis.get(key);
    if(data) {
        return res.json({
            products:JSON.parse(data),
        })
    }
    next();
}
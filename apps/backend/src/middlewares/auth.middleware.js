import {asyncHandler} from "../utils/asyncHandler.js";
import {STATUS} from "../constants/statusCodes.js";
import {ApiError} from "../utils/ApiError.js";
import {findSessionByAccessToken} from "../database/queries/auth.queries.js";

export const verifyJWT=asyncHandler(async (req, res,next) => {
  try{
    const token=req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","");

    if(!token){
      throw new ApiError(STATUS.CLIENT_ERROR.UNAUTHORIZED, "Unauthorized access");
    }

    const session=await findSessionByAccessToken(token);

    if(!session){
      throw new ApiError(STATUS.CLIENT_ERROR.UNAUTHORIZED, "Invalid Access Token");
    }

    req.session=session;
    next();
  }
  catch(err){
    throw new ApiError(STATUS.CLIENT_ERROR.UNAUTHORIZED, err.message||"Invalid access token");
  }
})
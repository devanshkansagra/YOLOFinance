import { IUser } from "../definitions/IUser";

export async function generateAuthTokens(user: IUser) {
  user.accessToken = await user.generateAccessToken();
  user.refreshToken = await user.generateRefreshToken();
  user.id_token = await user.generateIdToken();

  await user.save({ validateBeforeSave: false });

  return {
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
    id_token: user.id_token,
  };
}

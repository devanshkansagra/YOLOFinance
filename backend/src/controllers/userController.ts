import { Request, Response } from "express";
import { User } from "../model/user";
import { ACCESSS_TOKEN_URI, REDIRECT_URI } from "../constants/constants";
import { getAuthorizationURL } from "../handlers/getAuthorizationURL";
import { generateAuthTokens } from "../handlers/generateAuthTokens";

import { AuthRequest } from "../definitions/AuthRequest";
import { cookieOptions } from "../utils/cookieOptions";

export async function login(req: AuthRequest, res: Response): Promise<void> {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    const isMatch = user.isPasswordCorrect(password);
    if (!isMatch) {
      res.status(401).send({ message: "Invalid credentials" });
      return;
    }

    const { id_token, refreshToken, accessToken } =
      await generateAuthTokens(user);

    res.cookie("id_token", id_token, );
    res.cookie("access_token", accessToken, cookieOptions as object);

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function signup(req: Request, res: Response) {
  const { name, email, username, password } = req.body;
  try {
    const doesExists = await User.findOne({ email });
    if (doesExists) {
      res.status(409).send({ message: "User already exists" });
    } else {
      const user = new User({ name, email, password, username });
      const response = await user.save();
      const { id_token, accessToken } = await generateAuthTokens(user);
      if (response) {
        res
          .cookie("id_token", id_token, cookieOptions as object)
          .cookie("access_token", accessToken, cookieOptions as object);
        res.status(201).send({ message: "New User Created" });
      }
    }
  } catch (error) {
    res.send(error);
  }
}

export async function googleOAuth(req: Request, res: Response) {
  const oauthURL = getAuthorizationURL();
  res.redirect(oauthURL);
}

export async function googleOAuthCallback(req: Request, res: Response) {
  const { code } = req.query;
  const response = await getGoogleOauthAccessToken(code as string);

  const access_token = {
    token: response?.access_token,
    refresh_token: response?.refresh_token,
    scope: response?.scope,
    id_token: response?.id_token,
  };

  const userInfo = await getOauthUserInfo(access_token?.token as string);

  const username = userInfo.email.split("@")[0];

  try {
    const doesExists = await User.findOne({ email: userInfo.email });
    if (doesExists) {
      const { id_token, accessToken } = await generateAuthTokens(doesExists);
      res
        .cookie("id_token", id_token, cookieOptions as object)
        .cookie("access_token", accessToken, {
          httpOnly: false,
          maxAge: 3599 * 1000,
          secure: true,
          path: "/",
          sameSite: "none"
        });
      return res.redirect(`${process.env.ORIGIN}/Dashboard`);
    } else {
      const user = new User({
        name: userInfo.name,
        email: userInfo.email,
        username,
        authProvider: "Google",
        avatar: userInfo.picture,
      });

      const { id_token, accessToken } = await generateAuthTokens(user);
      const response1 = await user.save();
      if (response1) {
        res
          .cookie("id_token", id_token, cookieOptions as object)
          .cookie("access_token", accessToken, {
            httpOnly: false,
            maxAge: 3599 * 1000,
            secure: true,
            path: "/",
            sameSite: "none"
          });
        return res.redirect(`${process.env.ORIGIN}/Dashboard`);
      }
    }
  } catch (error) {
    return res.redirect(`${process.env.ORIGIN}/signup?error=server`);
  }
}

async function getOauthUserInfo(token: string) {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET",
      }
    );

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

async function getGoogleOauthAccessToken(code: string) {
  try {
    const response = await fetch(ACCESSS_TOKEN_URI, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `code=${code}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&redirect_uri=${process.env.SERVER_URL}/api/users/google-oauth-callback&grant_type=authorization_code`,
      method: "POST",
    });

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export async function userLogout(req: Request, res: Response) {
  try {
    res
      .clearCookie("id_token", cookieOptions as object)
      .clearCookie("access_token", cookieOptions as object);
    res.status(200).json({ message: "User Logout" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Logout failed" });
  }
}

export async function fetchUsers(req: AuthRequest, res: Response) {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id).select("connections");
    const connections = user?.connections || [];

    const users = await Promise.all(
      connections.map(async (connectionId) => {
        const u = await User.findById(connectionId).select("name email");
        return { id: u?._id, name: u?.name, email: u?.email, avatar: u?.avatar };
      })
    );

    res
      .status(200)
      .send({ message: "Connections Fetched Successfully", data: users });
  } catch (error) {}
}

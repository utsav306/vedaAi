import { Router } from "express";
import { HttpError } from "../../middleware/errorHandler";
import { UserModel } from "../../db/models/User";
import { hashPassword, comparePassword } from "../../services/password";
import { signAccessToken } from "../../services/jwt";
import { loginSchema, registerSchema } from "../assignments/validation";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const input = registerSchema.parse(req.body);

  const existing = await UserModel.findOne({ email: input.email });
  if (existing) {
    throw new HttpError(409, "Email is already registered", "EMAIL_TAKEN");
  }

  const user = await UserModel.create({
    name: input.name,
    email: input.email,
    passwordHash: await hashPassword(input.password),
  });

  const token = signAccessToken({ userId: user._id.toString(), email: user.email });

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

authRouter.post("/login", async (req, res) => {
  const input = loginSchema.parse(req.body);

  const user = await UserModel.findOne({ email: input.email });
  if (!user) {
    throw new HttpError(401, "Invalid credentials", "INVALID_CREDENTIALS");
  }

  const validPassword = await comparePassword(input.password, user.passwordHash);
  if (!validPassword) {
    throw new HttpError(401, "Invalid credentials", "INVALID_CREDENTIALS");
  }

  const token = signAccessToken({ userId: user._id.toString(), email: user.email });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export { authRouter };

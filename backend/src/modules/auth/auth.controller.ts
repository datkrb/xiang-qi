import { Request, Response } from "express";
import * as authService from "./auth.service";
import { ApiResponse } from "../../types/ApiResponse";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.register(email, password);

    const response: ApiResponse<any> = {
      code: 201,
      message: "User registered successfully",
      data: result,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    const response: ApiResponse<any> = {
      code: 200,
      message: "Login successful",
      data: result,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const result = await authService.logout(userId!);

    const response: ApiResponse<any> = {
      code: 200,
      message: "Logout successful",
      data: result,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

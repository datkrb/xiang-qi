import { Request, Response } from "express";
import * as userService from "./user.service";
import { ApiResponse } from "../../types/ApiResponse";

//get all users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    const response: ApiResponse<any> = {
      code: 200,
      message: "Users retrieved successfully",
      data: users,
    };
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

//get user by id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params["id"] as string;
    const user = await userService.getUserById(id);
    const response: ApiResponse<any> = {
      code: 200,
      message: "User retrieved successfully",
      data: user,
    };
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};
//create user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    const user = await userService.createUser(email, password, role);
    const response: ApiResponse<any> = {
      code: 201,
      message: "User created successfully",
      data: user,
    };
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};
//update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params["id"] as string;
    const newUserData = req.body;
    const updatedUser = await userService.updateUser(id, newUserData);
    const response: ApiResponse<any> = {
      code: 200,
      message: "User updated successfully",
      data: updatedUser,
    };
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};
//delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params["id"] as string;
    await userService.deleteUser(id);
    const response: ApiResponse<null> = {
      code: 200,
      message: "User deleted successfully",
      data: null,
    };
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

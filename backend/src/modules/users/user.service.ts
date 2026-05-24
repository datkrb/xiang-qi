import prisma from "../../utils/prisma";
import { hashPassword } from "../../utils/bcrypt";
import { Role } from "@prisma/client";
import { Prisma } from "@prisma/client";

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
    },
  });
  return users;
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const createUser = async (
  email: string,
  password: string,
  role: Role,
) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Email already in use");
  }
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
    },
  });
  return user;
};

export const updateUser = async (
  id: string,
  newUserData: Prisma.UserUpdateInput,
) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: newUserData,
  });

  return updatedUser;
};

export const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new Error("User not found");
  }
  await prisma.user.delete({
    where: { id },
  });
};

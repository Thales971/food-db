import prisma from "../utils/prismaClient.js";

//* Model das comidas 
export const create = async (data) => {
  return await prisma.food.create({ data });
};

export const findAll = async (filters = {}) => {
  const { name, description, price, category } = filters;
  const where = {};

  if (name) where.name = { contains: name, mode: "insensitive" };
  if (description)
    where.description = { contains: description, mode: "insensitive" };
  if (price !== undefined) where.price = parseFloat(price);
  if (category) where.category = { contains: category, mode: "insensitive" };
  if (filters.available !== undefined) where.available = filters.available;

  return await prisma.food.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
};

export const findById = async (id) => {
  return await prisma.food.findUnique({
    where: { id: parseInt(id) },
  });
};

export const update = async (id, data) => {
  return await prisma.food.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const remove = async (id) => {
  return await prisma.food.delete({
    where: { id: parseInt(id) },
  });
};

import { Request, Response } from "express";
import * as z from "zod";
import db from "backend/db/db";
import { httpStatus } from "server";
import {
  NewCustomerSchema,
  PaginationOptsSchema,
  UpdateCustomerSchema,
  UpdateCustomersSchema,
} from "@/common/validations";
import { NotFoundResourceError } from "backend/lib/exceptions";
import { RunResult } from "better-sqlite3";

export const getCustomers = (req: Request, res: Response) => {
  const { page, limit } = PaginationOptsSchema.parse(req.query);
  const result = db.getCustomers({
    page: page || 1,
    limit: limit || 20,
  });
  return res.status(httpStatus.OK).json(result);
};

export const getCustomerByEmail = (req: Request, res: Response) => {
  const email = z.string().email().parse(req.params.email);
  const result = db.getCustomerByEmail(email);
  if (!result)
    throw new NotFoundResourceError(
      `Customer with email = '${email}' is not found!`,
      "customer"
    );
  return res.status(httpStatus.OK).json(result);
};

export const createCustomer = (req: Request, res: Response) => {
  const newCustomer = NewCustomerSchema.parse(req.body);
  const result = db.insertCustomer(newCustomer);
  return res.status(httpStatus.CREATED).json(result);
};

export const updateCustomer = (req: Request, res: Response) => {
  const email = z.string().email().parse(req.params.email);
  const newCustomerInfo = UpdateCustomerSchema.parse(req.body);
  const result = db.updateCustomer(email, newCustomerInfo);
  if (!result)
    throw new NotFoundResourceError(
      `Customer with email = '${email}' is not found!`,
      "customer"
    );
  return res.status(httpStatus.OK).json(result);
};

export const updateCustomers = (req: Request, res: Response) => {
  const parsed = UpdateCustomersSchema.parse(req.body);
  let result: RunResult;
  if (parsed.type === "Flat")
    result = db.updateDiscountRate(parsed.discountRate);
  else result = db.updateThreshold(parsed.threshold);
  return res.status(httpStatus.OK).json({ changes: result.changes });
};

export const deleteCustomer = (req: Request, res: Response) => {
  const email = z.string().email().parse(req.params.email);
  const result = db.deleteCustomer(email);
  if (!result)
    throw new NotFoundResourceError(
      `Customer with email = '${email}' is not found!`,
      "customer"
    );
  return res.status(httpStatus.NO_CONTENT).json({ changes: result.changes });
};

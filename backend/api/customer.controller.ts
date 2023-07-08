import { Request, Response } from "express";
import * as z from "zod";
import db from "backend/db/db";
import { httpStatus } from "server";
import {
  NewCustomerSchema,
  UpdateCustomerSchema,
  UpdateCustomersSchema,
} from "@/common/validations";

export const getCustomers = (req: Request, res: Response) => {
  const { page, limit } = req.query;

  const querySchema = z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
  });

  try {
    const q = querySchema.parse({ page, limit });
    const result = db.getCustomers({ page: q.page || 1, limit: q.limit || 20 });
    return res.status(httpStatus.OK).json(result);
  } catch (err: any) {
    return res
      .status(
        err.error.type === "DB" || err instanceof z.ZodError
          ? httpStatus.BAD_REQUEST
          : httpStatus.INTERNAL_SERVER_ERROR
      )
      .json({ error: { msg: err.error.msg } });
  }
};

export const getCustomerByEmail = (req: Request, res: Response) => {
  const querySchema = z.string().email();

  try {
    const email = querySchema.parse(req.params.email);
    const result = db.getCustomerByEmail(email);
    if (!result) {
      return res.status(httpStatus.NOT_FOUND).json({});
    }
    return res.status(httpStatus.OK).json(result);
  } catch (err: any) {
    return res
      .status(
        err.error?.type === "DB" || err instanceof z.ZodError
          ? httpStatus.BAD_REQUEST
          : httpStatus.INTERNAL_SERVER_ERROR
      )
      .json({ error: { msg: err.error?.msg } });
  }
};

export const createCustomer = (req: Request, res: Response) => {
  try {
    const newCustomer = NewCustomerSchema.parse(req.body);
    const result = db.insertCustomer(newCustomer);
    return res.status(httpStatus.CREATED).json(result);
  } catch (err: unknown) {
    console.log(err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: { msg: "Something wrong happends!" } });
  }
};

export const updateCustomer = (req: Request, res: Response) => {
  try {
    console.log(req.body, req.params);
    const email = z.string().email().parse(req.params.email);
    const newCustomerInfo = UpdateCustomerSchema.parse(req.body);
    const updatedCustomer = db.updateCustomer(email, newCustomerInfo);
    return res.status(httpStatus.OK).json(updatedCustomer);
  } catch (err: unknown) {
    console.log(err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: { msg: "Something wrong happends!" } });
  }
};

export const updateCustomers = (req: Request, res: Response) => {
  try {
    const newInfo = UpdateCustomersSchema.parse(req.body);
    if (newInfo.type === "Flat") {
      db.updateDiscountRate(newInfo.discountRate);
    } else {
      db.updateThreshold(newInfo.threshold);
    }
    return res.status(httpStatus.OK).json({ updated: true });
  } catch (err: unknown) {
    console.log(err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: { msg: "Something wrong happends!" } });
  }
};

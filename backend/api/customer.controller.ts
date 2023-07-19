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
import { NotFoundResourceError } from "backend/lib/errors";
import { RunResult } from "better-sqlite3";

export const getCustomers = (req: Request, res: Response) => {
  const { page, limit, filter } = PaginationOptsSchema.parse(req.query);
  const result = db.getCustomers({
    page: page || 1,
    limit: limit || 20,
    filter: filter,
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
  // RES --> no new data has been specified
  if (
    Object.keys(req.body).length === 0 ||
    Object.keys(req.body).filter(
      (key) => req.body[key] !== undefined && req.body[key] !== null
    ).length === 0
  ) {
    return res.status(httpStatus.OK).json({
      warning: { msg: "Received an empty body! No changes has been made!" },
    });
  }
  // validate data from client
  const email = z.string().email().parse(req.params.email);
  const newCustomerInfo = UpdateCustomerSchema.parse(req.body);
  // get type of customer first
  const customer = db.getCustomerByEmail(email);
  if (!customer)
    throw new NotFoundResourceError(
      `Customer with email = '${email}' is not found!`,
      "customer"
    );
  // ignore fields based on customer types
  if (customer.type === "Normal") {
    newCustomerInfo.discountRate = undefined;
    newCustomerInfo.threshold = undefined;
  } else if (customer.type === "Flat") {
    newCustomerInfo.threshold = undefined;
  }
  // update customer if valid
  const result = db.updateCustomer(email, {
    ...newCustomerInfo,
    type: customer.type,
  });
  // RES --> no vields to update
  if (!result) {
    return res.status(httpStatus.OK).json({
      warning: {
        msg: "No changes has been made! This is probably because the requested changes is not relevant to the type of customer!",
      },
    });
  }

  // RES --> OK
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

// NOTE: Customer can't be deleted due to the FK constrains
// export const deleteCustomer = (req: Request, res: Response) => {
//   const email = z.string().email().parse(req.params.email);
//   const result = db.deleteCustomer(email);
//   if (!result)
//     throw new NotFoundResourceError(
//       `Customer with email = '${email}' is not found!`,
//       "customer"
//     );
//   return res.status(httpStatus.NO_CONTENT).json({ changes: result.changes });
// };

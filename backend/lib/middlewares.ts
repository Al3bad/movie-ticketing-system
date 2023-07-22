import { Request, Response, NextFunction } from "express";
import { SqliteError } from "better-sqlite3";
import { ZodError } from "zod";
import {
  InvalidTicketComponentError,
  SeatsRangeError,
  NotFoundResourceError,
  DuplicationError,
} from "./errors";
import { httpStatus } from "server";
import db from "backend/db/db";

export const cors = (_: Request, res: Response, next: NextFunction) => {
  // reference: https://stackoverflow.com/a/7069902
  // Allow frontend to use the API in the dev environment
  if (process.env.NODE_ENV !== "production") {
    res.header("Access-Control-Allow-Origin", [
      process.env.DOMAIN_URL || "http://localhost:5173",
    ]);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ]);
    res.header("Access-Control-Allow-Headers", ["Content-Type"]);
  }
  next();
};

export const notFoundApiEndpoint = (_: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND);
  res.end();
};

export const errorHandler = (
  err: unknown,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  // Rollback if the DB in transaction
  if (db.connection.inTransaction) db.connection.prepare("ROLLBACK").run();
  // ---------------------------------
  if (err instanceof ZodError) {
    // thrown from:
    //    - database interface methods (db.ts file)
    //    - route controllers (*.controller.ts files)
    // reasons:
    //    - invalid input to database
    //    - invalid input to route
    // action:
    //    - respond with and error message mentioning the invalid values
    const normalisedIssues: any = [];
    err.issues.forEach((issue) => {
      if (issue.code === "invalid_union") {
        issue.unionErrors.forEach((unionIssues) => {
          unionIssues.issues.forEach((unionIssue) => {
            normalisedIssues.push({
              path: unionIssue.path,
              msg: unionIssue.message,
            });
          });
        });
      } else {
        normalisedIssues.push({
          path: issue.path,
          msg: issue.message,
        });
      }
    });
    return res.status(httpStatus.BAD_REQUEST).json({
      error: { msg: "Invalid data", details: { issues: normalisedIssues } },
    });
  } else if (err instanceof NotFoundResourceError) {
    // thrown from:
    //    - database interface methods (db.ts file)
    // reasons:
    //    - resource is not found in DB
    // action:
    //    - respond with and error message with the resource type
    return res.status(httpStatus.NOT_FOUND).json({
      error: {
        msg: err.message,
        details: { resourceType: err.resourceType },
      },
    });
  } else if (err instanceof InvalidTicketComponentError) {
    // thrown from:
    //    - database interface
    // reasons:
    //    - type === component
    // action:
    //    - respond with and error message mentioning the invalid values
    return res.status(httpStatus.BAD_REQUEST).json({
      error: {
        msg: err.message,
        details: {
          issues: [
            { path: "type", msg: "ticket type must not equal component" },
            { path: "component", msg: "'ticket' must not equal 'component'" },
          ],
        },
      },
    });
  } else if (err instanceof SeatsRangeError) {
    // thrown from:
    //    - database interface methods
    // reasons:
    //    - trying to insert/update movie.steatsAvailable with an invalid/out of range number
    // action:
    //    - respond with and error message mentioning the invalid values
    const issues = err.issues.map((issue) => {
      return {
        path: issue.path,
        msg: issue.message,
      };
    });
    return res.status(httpStatus.BAD_REQUEST).json({
      error: {
        msg: err.message,
        details: { issues },
      },
    });
  } else if (err instanceof DuplicationError) {
    // thrown from:
    //    - database interface
    // reasons:
    //    - SQLITE_CONSTRAINT_PRIMARYKEY
    // action:
    //    - respond with and error message mentioning the invalid values
    return res.status(httpStatus.BAD_REQUEST).json({
      error: {
        msg: err.message,
        details: {
          issues: [{ path: err.token, msg: `${err.value} already exists!` }],
        },
      },
    });
  } else if (err instanceof SqliteError) {
    // thrown from:
    //    - database interface
    // reasons:
    //    - ...
    // action:
    //    - respond with and an error message to the frontend
    switch (err.code) {
      case "SQLITE_CONSTRAINT_PRIMARYKEY":
        return res.status(httpStatus.BAD_REQUEST).json({
          error: {
            msg: "Resource already exists!",
          },
        });
        break;
      case "SQLITE_CONSTRAINT_FOREIGNKEY":
        return res.status(httpStatus.BAD_REQUEST).json({
          error: {
            msg: "You are using a resource that does not exist",
          },
        });
        break;
      default:
        // TODO: log error somewhere -- DB?
        console.error(err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          error: {
            msg: "Something wrong happend! Please contact the developer!",
          },
        });
        break;
    }
  } else {
    // thrown from:
    //    - unknown/anywhere
    // reasons:
    //    - unknown
    // action:
    //    - log error
    //    - respond wiht an internal server error
    // TODO: log error somewhere -- DB?
    console.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: { msg: "Something wrong happend! Please contact the developer!" },
    });
  }
};

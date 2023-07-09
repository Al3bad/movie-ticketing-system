// ZodError -> invalid input -> contruct error msgs to the frontend
// SqliteError -> exceptions related to DB -> log error -> tell frontend that something wrong happend in the server
// NotFoundResource -> not found requested resource is not found in the database -> construcute error msgs to the frontend
// Error -> Unknonw exception -> log error -> tell frontend that something wrong happend in the server

export class NotFoundResourceError extends Error {
  resourceType: string;

  constructor(msg: string, resourceType: string) {
    super(msg);
    Object.setPrototypeOf(this, new.target.prototype);
    this.resourceType = resourceType;
  }
}

export class InvalidTicketComponentError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SeatsRangeError extends Error {
  issues: Array<{ path: string[]; message: string }>;

  constructor(msg: string, issues: Array<{ path: string[]; message: string }>) {
    super(msg);
    Object.setPrototypeOf(this, new.target.prototype);
    this.issues = issues;
  }
}

export class DuplicationError extends Error {
  token: string;
  value: string | number;
  constructor(msg: string, token: string, value: string | number) {
    super(msg);
    Object.setPrototypeOf(this, new.target.prototype);
    this.token = token;
    this.value = value;
  }
}

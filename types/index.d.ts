// ==============================================
// --> Customer utils
// ==============================================

// reference: https://stackoverflow.com/a/55032655/10823489
// Overriding property of a type
type Modify<T, R> = Omit<T, keyof R> & R;

// ==============================================
// --> Movie types
// ==============================================

type Movie = {
  title: string;
  seatAvailable: number;
  isReleased: boolean;
};

type UpdateMovie = {
  title: string;
  seatAvailable: number | null;
  isReleased: boolean | null;
};

type RequestedSeats = {
  title: string;
  qty: number;
};

// ==============================================
// --> Ticket types
// ==============================================

type NewTicket = {
  type: string;
  price?: number;
};

type Ticket = Required<NewTicket> & { qty: number };

type UpdateTicket = Modify<
  Ticket,
  {
    price?: number | null;
    qty?: number | null;
  }
>;

type RequestedTicket = {
  type: string;
  qty: number;
};

type NewTicketComponent = {
  type: string;
  component: string;
  qty: number;
};

type TicketComponent = NewTicketComponent;

type GroupTicket = NewTicket & {
  components: Ticket[];
};

type NewGroupTicket = GroupTicket;

// ==============================================
// --> Customer types
// ==============================================

type CustomerType = "Normal" | "Flat" | "Step";
type Customer = NormalCustomer | FlatCustomer | StepCustomer;

type NormalCustomer = {
  // id?: number;
  name: string;
  email: string;
  type: "Normal";
  discountRate?: 0 | null;
};

type FlatCustomer = Modify<
  NormalCustomer,
  {
    type: "Flat";
    discountRate: number;
  }
>;

type StepCustomer = Modify<
  FlatCustomer,
  {
    type: "Step";
    threshold: number;
  }
>;

// ==============================================
// --> Booking types
// ==============================================

type NewBooking = {
  // email: string;
  // name: string;
  // type: CustomerType;
  customer: Customer;
  title: string;
  tickets: RequestedTicket[];
  discountRate: number;
  threshold?: number | null;
};

type Booking = NewBooking & {
  id: number;
};

// ==============================================
// --> Type for backend
// ==============================================

declare namespace Backend {
  type ReqData = {
    name: string;
    type: "string" | "integer" | "number" | "boolean";
    description: string;
    default?: string | number | boolean;
    required?: boolean;
  };
  type Route = {
    method: "get" | "post" | "put" | "delete";
    endpoint: string;
    description?: string;
    parameters?: ReqData[];
    query?: ReqData[];
    json?: ReqData[];
    controller: any;
  };
}

// ==============================================
// --> Customer utils
// ==============================================

// reference: https://stackoverflow.com/a/55032655/10823489
// Overriding property of a type
type Modify<T, R> = Omit<T, keyof R> & R;

// ==============================================
// --> Movie types
// ==============================================

type NewMovie = {
  title: string;
  seatAvailable: number;
  isReleased: boolean;
};

type Movie = NewMovie & {
  id: number;
};

// ==============================================
// --> Ticket types
// ==============================================

type NewTicket = {
  type: string;
  price?: number;
};

type Ticket = Required<NewTicket> & { qty: number };

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

type NormalCustomer = {
  id?: number;
  name: string;
  email: string;
  type: "Normal";
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
  customer: NormalCustomer | FlatCustomer | StepCustomer;
  movie: string;
  tickets: RequestedTicket[];
};

type Booking = NewBooking & {
  id: number;
};

// ==============================================
// --> Type for backend
// ==============================================

declare namespace Backend {
  type Route = {
    method: "get" | "post" | "put" | "delete";
    endpoint: string;
    description: string;
    controller?: any;
  };
}

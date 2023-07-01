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
  seatsAvailable: number;
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
};

type Ticket = NewTicket & {
  qty: number;
};

type GroupTicket = NewTicket & {
  components: Ticket[];
};

type NewGroupTicket = GroupTicket;

// ==============================================
// --> Customer types
// ==============================================

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
  email: string;
  name: string;
  type: string;
  movie: string;
  ticket: Ticket[];
};

type Booking = NewBooking & {
  id: number;
};

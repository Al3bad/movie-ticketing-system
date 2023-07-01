// ==============================================
// --> Customer utils
// ==============================================

// reference: https://stackoverflow.com/a/55032655/10823489
// Overriding property of a type
type Modify<T, R> = Omit<T, keyof R> & R;

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
// --> Movie types
// ==============================================

type Movie = {
  id: number;
  title: string;
  seatsAvailable: number;
  isReleased: boolean;
};

// ==============================================
// --> Ticket types
// ==============================================

type Ticket = {
  type: string;
  qty: number;
};

type NewTicket = {
  type: string;
};

type GroupTicket = {
  type: string;
  components: Ticket[];
};

type NewGroupTicket = GroupTicket;

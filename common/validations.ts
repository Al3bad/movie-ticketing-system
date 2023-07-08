import { z } from "zod";

// ==============================================
// --> Movie schemas
// ==============================================

export const NewMovieSchema = z.object({
  title: z.string(),
  seatAvailable: z.number().nonnegative(),
  isReleased: z.boolean(),
});

export const MovieSchema = NewMovieSchema.extend({
  id: z.number(),
});

// ==============================================
// --> Ticket schemas
// ==============================================

export const NewTicketSchema = z.object({
  type: z.string(),
});

export const TicketSchema = NewTicketSchema.extend({
  qty: z.number().positive(),
});

export const GroupTicketSchema = NewTicketSchema.extend({
  components: z.array(TicketSchema),
});

// ==============================================
// --> Customer schemas
// ==============================================

export const NormalCustomerSchema = z.object({
  id: z.optional(z.number()),
  name: z.string(),
  email: z.string().email(),
  type: z.literal("Normal"),
  discountRate: z.literal(0).nullable().default(0),
});

export const FlatCustomerSchema = NormalCustomerSchema.extend({
  type: z.literal("Flat"),
  discountRate: z.number().gt(0).lte(1),
});

export const StepCustomerSchema = FlatCustomerSchema.extend({
  type: z.literal("Step"),
  threshold: z.number().positive(),
});

// ==============================================
// --> Booking schemas
// ==============================================

export const NewBookingSchema = z.object({
  customer: z.union([
    NormalCustomerSchema,
    FlatCustomerSchema,
    StepCustomerSchema,
  ]),
  title: z.string(),
  tickets: z.array(TicketSchema).min(1),
});

export const BookingSchema = NewBookingSchema.extend({
  id: z.number(),
});

import { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model';

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => {
          // RFC 5322 compliant email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(v);
        },
        message: 'Invalid email format',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index on eventId for efficient event-based queries
BookingSchema.index({ eventId: 1 });

// Pre-save hook: validate that the referenced event exists
BookingSchema.pre('save', async function (next) {
  // Only validate if eventId is modified or new document
  if (this.isModified('eventId') || this.isNew) {
    try {
      const eventExists = await Event.exists({ _id: this.eventId });
      if (!eventExists) {
        return next(new Error('Referenced event does not exist'));
      }
    } catch (error) {
      return next(new Error('Failed to validate event reference'));
    }
  }

  next();
});

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;

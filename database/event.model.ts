import { Schema, model, models, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: ['online', 'offline', 'hybrid'],
      trim: true,
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Tags must contain at least one item',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster slug-based queries
EventSchema.index({ slug: 1 });

// Pre-save hook: generate slug from title (ensure uniqueness) and normalize date/time
EventSchema.pre('save', async function (this: any, next) {
  try {
    // Generate slug if title changed or slug not set
    if (this.isModified('title') || !this.slug) {
      const baseSlug = String(this.title || '')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen

      const EventModel = this.model('Event');
      let candidate: string = baseSlug || String(Date.now());
      let suffix = 0;

      while (true) {
        const exists = await EventModel.findOne({ slug: candidate, _id: { $ne: this._id } })
          .select('_id')
          .lean()
          .exec();
        if (!exists) break;
        suffix += 1;
        candidate = `${baseSlug}-${suffix}`;
      }

      this.slug = candidate;
    }

    // Normalize date to ISO format if modified
    if (this.isModified('date')) {
      const parsedDate = new Date(this.date);
      if (isNaN(parsedDate.getTime())) {
        return next(new Error('Invalid date format'));
      }
      this.date = parsedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    }

    // Normalize time to HH:MM format if modified
    if (this.isModified('time')) {
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      const timeStr = String(this.time).trim();
      if (!timeRegex.test(timeStr)) {
        return next(new Error('Time must be in HH:MM format'));
      }
      this.time = timeStr;
    }

    next();
  } catch (err) {
    next(err as any);
  }
});

const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;

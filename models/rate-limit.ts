import mongoose from "mongoose";

interface IRateLimit extends mongoose.Document {
  identifier: string;
  type: "email" | "ip";
  attempts: {
    timestamp: Date;
    success: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const RateLimitSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["email", "ip"],
      required: true,
    },
    attempts: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        success: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
    // Create compound index for efficient queries
    index: { identifier: 1, type: 1 },
  },
);

// TTL index to automatically clean up old documents after 24 hours
RateLimitSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86400 });

const RateLimit =
  mongoose.models.RateLimit ||
  mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);

export { RateLimit };

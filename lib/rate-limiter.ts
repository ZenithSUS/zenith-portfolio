import { RateLimit } from "@/models/rate-limit";
import { connectToDatabase } from "./mongodb";

interface RateLimitConfig {
  emailLimit: number;
  ipLimit: number;
  timeWindowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  totalAttempts: number;
  reason?: string;
}

export class MongoRateLimiter {
  private config: RateLimitConfig;

  constructor(
    config: RateLimitConfig = {
      emailLimit: 3,
      ipLimit: 10,
      timeWindowMs: 60 * 60 * 1000,
    },
  ) {
    this.config = config;
  }

  async checkRateLimit(
    identifier: string,
    type: "email" | "ip",
  ): Promise<RateLimitResult> {
    await connectToDatabase();

    const now = new Date();
    const windowStart = new Date(now.getTime() - this.config.timeWindowMs);
    const limit =
      type === "email" ? this.config.emailLimit : this.config.ipLimit;

    try {
      // First, clean up old attempts for this identifier
      await RateLimit.findOneAndUpdate(
        {
          identifier: identifier.toLowerCase(),
          type,
        },
        {
          $pull: {
            attempts: {
              timestamp: { $lt: windowStart },
            },
          },
        },
        { upsert: true },
      );

      // Then find the document to check current attempts
      const rateLimitDoc = await RateLimit.findOne({
        identifier: identifier.toLowerCase(),
        type,
      });

      const currentAttempts = rateLimitDoc?.attempts || [];
      const recentAttempts = currentAttempts.filter(
        (attempt: { timestamp: Date }) => attempt.timestamp >= windowStart,
      );

      const currentCount = recentAttempts.length;
      const remaining = Math.max(0, limit - currentCount);

      if (currentCount >= limit) {
        // Find the oldest attempt to calculate reset time
        const oldestAttempt = recentAttempts.reduce(
          (oldest: { timestamp: Date }, current: { timestamp: Date }) =>
            current.timestamp < oldest.timestamp ? current : oldest,
        );

        const resetTime = new Date(
          oldestAttempt.timestamp.getTime() + this.config.timeWindowMs,
        );

        return {
          allowed: false,
          remaining: 0,
          resetTime,
          totalAttempts: currentCount,
          reason: `Rate limit exceeded for ${type}. Try again after ${resetTime.toLocaleString()}`,
        };
      }

      return {
        allowed: true,
        remaining: remaining - 1, // Account for the current request
        resetTime: new Date(now.getTime() + this.config.timeWindowMs),
        totalAttempts: currentCount,
      };
    } catch (error) {
      console.error("Rate limit check error:", error);
      // Fail open - allow request if database is down
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: new Date(now.getTime() + this.config.timeWindowMs),
        totalAttempts: 0,
      };
    }
  }

  async recordAttempt(
    identifier: string,
    type: "email" | "ip",
    success: boolean = true,
  ): Promise<void> {
    await connectToDatabase();

    const now = new Date();
    const windowStart = new Date(now.getTime() - this.config.timeWindowMs);

    try {
      // First, remove old attempts
      await RateLimit.findOneAndUpdate(
        {
          identifier: identifier.toLowerCase(),
          type,
        },
        {
          $pull: {
            attempts: {
              timestamp: { $lt: windowStart },
            },
          },
        },
        { upsert: true },
      );

      // Then, add the new attempt
      await RateLimit.findOneAndUpdate(
        {
          identifier: identifier.toLowerCase(),
          type,
        },
        {
          $push: {
            attempts: {
              timestamp: now,
              success,
            },
          },
        },
        { upsert: true },
      );
    } catch (error) {
      console.error("Error recording attempt:", error);
    }
  }

  // Alternative single-operation approach using aggregation pipeline
  async recordAttemptOptimized(
    identifier: string,
    type: "email" | "ip",
    success: boolean = true,
  ): Promise<void> {
    await connectToDatabase();

    const now = new Date();
    const windowStart = new Date(now.getTime() - this.config.timeWindowMs);

    try {
      // Use aggregation pipeline to update in one operation
      await RateLimit.findOneAndUpdate(
        {
          identifier: identifier.toLowerCase(),
          type,
        },
        [
          {
            $set: {
              attempts: {
                $concatArrays: [
                  {
                    $filter: {
                      input: { $ifNull: ["$attempts", []] },
                      cond: { $gte: ["$$this.timestamp", windowStart] },
                    },
                  },
                  [
                    {
                      timestamp: now,
                      success: success,
                    },
                  ],
                ],
              },
            },
          },
        ],
        { upsert: true, new: true },
      );
    } catch (error) {
      console.error("Error recording attempt (optimized):", error);
      // Fallback to the two-step approach
      await this.recordAttempt(identifier, type, success);
    }
  }

  // Clean up old documents
  async cleanup(): Promise<void> {
    await connectToDatabase();

    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    try {
      await RateLimit.deleteMany({
        updatedAt: { $lt: cutoffDate },
      });
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  }

  // Get rate limit stats for admin purposes
  async getStats(
    identifier: string,
    type: "email" | "ip",
  ): Promise<{
    totalAttempts: number;
    successfulAttempts: number;
    recentAttempts: number;
    nextResetTime: Date;
  }> {
    await connectToDatabase();

    const windowStart = new Date(Date.now() - this.config.timeWindowMs);

    try {
      const rateLimitDoc = await RateLimit.findOne({
        identifier: identifier.toLowerCase(),
        type,
      });

      if (!rateLimitDoc) {
        return {
          totalAttempts: 0,
          successfulAttempts: 0,
          recentAttempts: 0,
          nextResetTime: new Date(Date.now() + this.config.timeWindowMs),
        };
      }

      const recentAttempts = rateLimitDoc.attempts.filter(
        (attempt: { timestamp: Date }) => attempt.timestamp >= windowStart,
      );

      const successfulAttempts = recentAttempts.filter(
        (attempt: { success: boolean }) => attempt.success,
      ).length;

      const nextResetTime =
        recentAttempts.length > 0
          ? new Date(
              Math.min(
                ...recentAttempts.map((a: { timestamp: Date }) =>
                  a.timestamp.getTime(),
                ),
              ) + this.config.timeWindowMs,
            )
          : new Date(Date.now() + this.config.timeWindowMs);

      return {
        totalAttempts: rateLimitDoc.attempts.length,
        successfulAttempts,
        recentAttempts: recentAttempts.length,
        nextResetTime,
      };
    } catch (error) {
      console.error("Error getting stats:", error);
      throw error;
    }
  }
}

import { createClient } from 'redis'
import { NextResponse } from 'next/server'

const WINDOW_SIZE_IN_SECONDS = 60
const MAX_REQUESTS_PER_WINDOW = 100

class RateLimiter {
  private client: ReturnType<typeof createClient> | null = null

  constructor() {
    this.initializeRedis()
  }

  private async initializeRedis() {
    try {
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      })
      await this.client.connect()
    } catch (error) {
      console.error('Redis connection failed:', error)
    }
  }

  async isRateLimited(identifier: string): Promise<boolean> {
    if (!this.client) return false

    const key = `rate_limit:${identifier}`
    const now = Math.floor(Date.now() / 1000)

    try {
      const pipeline = this.client.multi()
      pipeline.zRemRangeByScore(key, 0, now - WINDOW_SIZE_IN_SECONDS)
      pipeline.zCard(key)
      pipeline.zAdd(key, { score: now, value: now.toString() })
      pipeline.expire(key, WINDOW_SIZE_IN_SECONDS)

      const results = await pipeline.exec()
      const requestCount = results?.[1] as number

      return requestCount > MAX_REQUESTS_PER_WINDOW
    } catch (error) {
      console.error('Rate limiting error:', error)
      return false
    }
  }
}

export const rateLimiter = new RateLimiter()

export async function withRateLimit(
  request: Request,
  handler: (request: Request) => Promise<Response>
) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const isLimited = await rateLimiter.isRateLimited(ip)

  if (isLimited) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  return handler(request)
} 
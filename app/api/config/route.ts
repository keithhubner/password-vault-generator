import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hostedOn: process.env.NEXT_PUBLIC_HOSTED_ON || process.env.HOSTED_ON || ''
  })
}
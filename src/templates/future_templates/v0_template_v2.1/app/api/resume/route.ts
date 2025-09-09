import { NextResponse } from "next/server"
import data from "@/app/resume-data.json"

export async function GET() {
  // In a real app, you might fetch this from a database or a CMS
  return NextResponse.json(data)
}

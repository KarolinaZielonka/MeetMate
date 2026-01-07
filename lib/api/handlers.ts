import type { SupabaseClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"
import { supabaseAdmin } from "@/lib/supabase/server"
import type { ValidationResult } from "./schemas"

/**
 * Standard API response format
 */
export interface ApiResponse<T = unknown> {
  data: T | null
  error: string | null
}

/**
 * Configuration for API handlers
 */
export interface ApiHandlerConfig<TBody = unknown, TResult = unknown> {
  /** Parse and validate request body (for POST/PUT/PATCH) */
  parseBody?: (request: NextRequest) => Promise<TBody>
  /** Parse and validate route params */
  parseParams?: (params: unknown) => Promise<Record<string, string>>
  /** Validate the parsed body and params */
  validate?: (
    body: TBody,
    params: Record<string, string>,
    request: NextRequest
  ) => Promise<ValidationResult>
  /** Main handler logic */
  handler: (body: TBody, params: Record<string, string>, client: SupabaseClient) => Promise<TResult>
  /** Use admin client (bypasses RLS) - default: false */
  useAdminClient?: boolean
  /** Success HTTP status code - default: 200 */
  successStatus?: number
  /** Custom error messages */
  errorMessages?: {
    validation?: string
    notFound?: string
    serverError?: string
  }
}

/**
 * Generic API handler wrapper
 * Handles common patterns: param parsing, body parsing, validation, error handling, response formatting
 */
export function createApiHandler<TBody = unknown, TResult = unknown>(
  config: ApiHandlerConfig<TBody, TResult>
) {
  return async (
    request: NextRequest,
    context?: { params: Promise<Record<string, string>> | Record<string, string> }
  ): Promise<NextResponse<ApiResponse<TResult>>> => {
    try {
      // Parse route params
      let params: Record<string, string> = {}
      if (context?.params) {
        // Handle both Promise and direct params
        params = context.params instanceof Promise ? await context.params : context.params

        // Apply custom param parsing if provided
        if (config.parseParams) {
          params = await config.parseParams(params)
        }
      }

      // Parse request body (for POST/PUT/PATCH)
      let body = {} as TBody
      if (
        config.parseBody &&
        (request.method === "POST" || request.method === "PUT" || request.method === "PATCH")
      ) {
        try {
          body = await config.parseBody(request)
        } catch (error) {
          console.error("Body parsing error:", error)
          return NextResponse.json({ data: null, error: "Invalid request body" }, { status: 400 })
        }
      }

      // Validate inputs
      if (config.validate) {
        const validation = await config.validate(body, params, request)
        if (!validation.valid) {
          return NextResponse.json(
            {
              data: null,
              error: validation.error || config.errorMessages?.validation || "Validation failed",
            },
            { status: validation.status || 400 }
          )
        }
      }

      // Select appropriate Supabase client
      const client = config.useAdminClient ? supabaseAdmin : supabase

      // Execute handler
      const result = await config.handler(body, params, client)

      // Return success response
      return NextResponse.json(
        { data: result, error: null },
        { status: config.successStatus || 200 }
      )
    } catch (error) {
      console.error("API handler error:", error)

      // Check if it's a custom error with status
      if (error instanceof ApiError) {
        return NextResponse.json({ data: null, error: error.message }, { status: error.status })
      }

      // Generic server error
      return NextResponse.json(
        { data: null, error: config.errorMessages?.serverError || "An unexpected error occurred" },
        { status: 500 }
      )
    }
  }
}

/**
 * Custom API error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 500
  ) {
    super(message)
    this.name = "ApiError"
  }
}

/**
 * Helper: Fetch single record by field
 * Throws ApiError if record not found or database error occurs
 */
export async function fetchSingleRecord<T>(
  client: SupabaseClient,
  table: string,
  field: string,
  value: string,
  select = "*"
): Promise<T> {
  const { data, error } = await client.from(table).select(select).eq(field, value).single()

  if (error) {
    if (error.code === "PGRST116") {
      throw new ApiError(
        `${table.slice(0, -1).charAt(0).toUpperCase() + table.slice(0, -1).slice(1)} not found`,
        404
      )
    }
    console.error(`Database error fetching ${table}:`, error)
    throw new ApiError(`Failed to fetch ${table.slice(0, -1)}`, 500)
  }

  if (!data) {
    throw new ApiError(
      `${table.slice(0, -1).charAt(0).toUpperCase() + table.slice(0, -1).slice(1)} not found`,
      404
    )
  }

  return data as T
}

/**
 * Helper: Fetch multiple records by field
 * Returns empty array if no records found
 */
export async function fetchRecords<T>(
  client: SupabaseClient,
  table: string,
  field: string,
  value: string,
  select = "*"
): Promise<T[]> {
  const { data, error } = await client.from(table).select(select).eq(field, value)

  if (error) {
    console.error(`Database error fetching ${table}:`, error)
    throw new ApiError(`Failed to fetch ${table}`, 500)
  }

  return (data || []) as T[]
}

/**
 * Helper: Insert record
 * Throws ApiError if insert fails
 */
export async function insertRecord<T>(
  client: SupabaseClient,
  table: string,
  record: Record<string, unknown>
): Promise<T> {
  const { data, error } = await client.from(table).insert(record).select().single()

  if (error) {
    console.error(`Database error inserting into ${table}:`, error)
    throw new ApiError(`Failed to insert ${table.slice(0, -1)}`, 500)
  }

  if (!data) {
    throw new ApiError(`Failed to insert ${table.slice(0, -1)}`, 500)
  }

  return data as T
}

/**
 * Helper: Update record by field
 * Throws ApiError if update fails
 */
export async function updateRecord<T>(
  client: SupabaseClient,
  table: string,
  field: string,
  value: string,
  updates: Record<string, unknown>
): Promise<T> {
  const { data, error } = await client
    .from(table)
    .update(updates)
    .eq(field, value)
    .select()
    .single()

  if (error) {
    console.error(`Database error updating ${table}:`, error)
    throw new ApiError(`Failed to update ${table.slice(0, -1)}`, 500)
  }

  if (!data) {
    throw new ApiError(`Failed to update ${table.slice(0, -1)}`, 500)
  }

  return data as T
}

/**
 * Helper: Delete record by field
 * Throws ApiError if delete fails
 */
export async function deleteRecord(
  client: SupabaseClient,
  table: string,
  field: string,
  value: string
): Promise<void> {
  const { error } = await client.from(table).delete().eq(field, value)

  if (error) {
    console.error(`Database error deleting from ${table}:`, error)
    throw new ApiError(`Failed to delete ${table.slice(0, -1)}`, 500)
  }
}

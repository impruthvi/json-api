import { NextRequest, NextResponse } from "next/server";
import { z, ZodTypeAny } from "zod";

const determineSchemaType = (schema: any) => {
  if (!schema.hasOwnProperty("type")) {
    if (Array.isArray(schema)) {
      return "array";
    } else {
      return typeof schema;
    }
  }
};

const jsonSchemaToZod = (schema: any) => {
  const type = determineSchemaType(schema);

  switch (type) {
    case "string":
      return z.string().nullable();
    case "number":
      return z.number().nullable();
    case "boolean":
      return z.boolean().nullable();
    case "array":
      return z.array(jsonSchemaToZod(schema.items)).nullable();
  }
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  // step 1: request validation
  const generizSchema = z.object({
    data: z.string(),
    format: z.object({}).passthrough(),
  });

  const { data, format } = generizSchema.parse(body);

  // step 2: create a schema for the expected user format
  const dynamicSchema = jsonSchemaToZod(format);

  return new NextResponse("OK");
};

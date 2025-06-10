// src/app/api/tools/route.ts

import { NextResponse } from "next/server";
import { handleToolCall } from "../../lib/toolLogic";

// Este handler se activa en POST http://localhost:3000/api/tools
export async function POST(request: Request) {
  // Esperamos un body JSON { toolName: string, args: any }
  const { toolName, args } = await request.json();
  // Delegamos en tu lógica de herramientas
  const result = await handleToolCall(toolName, args);
  // Respondemos con { success: boolean, data?: any }
  return NextResponse.json(result);
}

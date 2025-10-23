import { NextRequest, NextResponse } from "next/server";

import { NATIONS_BY_CODE } from "@/data/nations";
import { assertNationCode, InvalidQueryError } from "@/lib/nation-api";

export async function GET(
  _request: NextRequest,
  { params }: { params: { code: string } },
) {
  try {
    const code = assertNationCode(params.code);
    const nation = NATIONS_BY_CODE[code];

    if (!nation) {
      return NextResponse.json({ error: `Nation with code ${code} was not found.` }, { status: 404 });
    }

    return NextResponse.json({
      data: nation,
      meta: { code },
    });
  } catch (error) {
    if (error instanceof InvalidQueryError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Failed to retrieve nation." }, { status: 500 });
  }
}

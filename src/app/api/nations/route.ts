import { NextRequest, NextResponse } from "next/server";

import {
  buildFilterSummary,
  InvalidQueryError,
  listNations,
  parseNationListQuery,
} from "@/lib/nation-api";

export async function GET(request: NextRequest) {
  try {
    const query = parseNationListQuery(request.nextUrl.searchParams);
    const result = listNations(query);
    const filters = buildFilterSummary(result.query);

    return NextResponse.json({
      data: result.items,
      meta: {
        total: result.total,
        filtered: result.filteredTotal,
        count: result.items.length,
        hasMore: result.hasMore,
        limit: result.query.limit ?? null,
        sort: {
          field: result.query.sort,
          order: result.query.order,
        },
        filters,
      },
    });
  } catch (error) {
    if (error instanceof InvalidQueryError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Failed to retrieve nations." }, { status: 500 });
  }
}

import { isValidISBN } from "@/lib/isbn";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const isbn = searchParams.get("isbn");

	if (!isbn) {
		return NextResponse.json({ error: "ISBN required" }, { status: 400 });
	}

	const cleanedISBN = isbn.replace(/\D/g, "");

	if (!isValidISBN(cleanedISBN)) {
		return NextResponse.json({ error: "Invalid ISBN" }, { status: 400 });
	}

	try {
		const response = await fetch(
			`https://openlibrary.org/api/books?bibkeys=ISBN:${cleanedISBN}&jscmd=details&format=json`
		);
		const data = await response.json();

		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch book data" },
			{ status: 500 }
		);
	}
}

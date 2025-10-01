import { isValidISBN, normalizeISBN } from "@/lib/isbn";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const isbn = searchParams.get("isbn");

	if (!isbn) {
		return NextResponse.json({ error: "ISBN required" }, { status: 400 });
	}

	const isbnDigits = isbn.replace(/\D/g, "");

	if (!isValidISBN(isbnDigits)) {
		return NextResponse.json({ error: "Invalid ISBN" }, { status: 400 });
	}

	const normalizedISBN = normalizeISBN(isbnDigits);

	const getMetaData = async (url: string | Request | URL) => {
		try {
			const response = await fetch(url);
			const data = await response.json();

			return data;
		} catch (error) {
			return NextResponse.json(
				{ error: "Failed to fetch book data" },
				{ status: 500 }
			);
		}
	};

	const googleBooks = await getMetaData(
		`https://www.googleapis.com/books/v1/volumes?q=isbn:${normalizedISBN}&key=${process.env.GOOGLE_BOOKS}`
	);
	const openlibrary = await getMetaData(
		`https://openlibrary.org/api/books?bibkeys=ISBN:${normalizedISBN}&jscmd=details&format=json`
	);

	console.log(googleBooks);
	console.log(openlibrary);
}

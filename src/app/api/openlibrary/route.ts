import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const isbn = searchParams.get("isbn");

	if (!isbn) {
		return NextResponse.json({ error: "ISBN required" }, { status: 400 });
	}

	const isValidISBN = (isbn: string) => {
		const cleanedISBN = isbn.replace(/\D/g, "");

		const isTenDigits = cleanedISBN.length === 10;
		const isThirteenDigits = cleanedISBN.length === 13;

		if (!isTenDigits && !isThirteenDigits) {
			return false;
		}

		if (isTenDigits) {
			let sum = 0;

			for (let i = 0; i < isbn.length; i++) {
				sum += Number(isbn[i]) * (10 - i);
			}

			return sum % 11 === 0;
		}

		if (isThirteenDigits) {
			let sum = 0;

			for (let i = 0; i < isbn.length; i++) {
				sum += Number(isbn[i]) * (i % 2 === 0 ? 1 : 3);
			}

			return sum % 10 === 0;
		}
	};

	if (!isValidISBN(isbn)) {
		return NextResponse.json({ error: "Invalid ISBN" }, { status: 400 });
	}

	try {
		const response = await fetch(
			`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`
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

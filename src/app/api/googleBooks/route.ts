import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const isbn = searchParams.get("isbn");

	if (!isbn) {
		return NextResponse.json({ error: "ISBN required" }, { status: 400 });
	}

	try {
		const response = await fetch(
			`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${process.env.GOOGLE_BOOKS}`
		);
		const data = await response.json();

		return NextResponse.json(data);
	} catch (error) {
        return NextResponse.json({error: "Failed to fetch book data"}, {status: 500})
    }
}

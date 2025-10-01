import { prisma } from "@/lib/db";
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
	const existingMetadata = await prisma.book.findUnique({
		where: { isbn: normalizedISBN }
	});

	if (existingMetadata) {
		return NextResponse.json(existingMetadata);
	}

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
	const openLibrary = await getMetaData(
		`https://openlibrary.org/api/books?bibkeys=ISBN:${normalizedISBN}&jscmd=details&format=json`
	);

	const authors = new Set([
		...(googleBooks?.items?.[0]?.volumeInfo?.authors || []),
		...(openLibrary[`ISBN:${normalizedISBN}`]?.details?.authors?.map(
			(author: { key: string; name: string }) => author.name
		) || [])
	]);

	const metadata = {
		authors: Array.from(authors) as string[],
		coverURL:
			googleBooks?.items?.[0]?.volumeInfo?.imageLinks?.extraLarge ||
			googleBooks?.items?.[0]?.volumeInfo?.imageLinks?.large ||
			openLibrary[`ISBN:${normalizedISBN}`]?.thumbnail_url?.replace(
				"-S",
				"-L"
			) ||
			googleBooks?.items?.[0]?.volumeInfo?.imageLinks?.medium ||
			googleBooks?.items?.[0]?.volumeInfo?.imageLinks?.small ||
			googleBooks?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail ||
			googleBooks?.items?.[0]?.volumeInfo?.imageLinks?.smallThumbnail ||
			"",
		description:
			googleBooks?.items?.[0]?.volumeInfo?.description ||
			openLibrary[`ISBN:${normalizedISBN}`]?.details?.description
				?.value ||
			"",
		subtitle: googleBooks?.items?.[0]?.volumeInfo?.title?.includes(":")
			? googleBooks?.items?.[0]?.volumeInfo?.title
					?.split(":")
					.filter(Boolean)
					.map((t) => t.trim())[1]
			: googleBooks?.items?.[0]?.volumeInfo?.subtitle ||
			  openLibrary[`ISBN:${normalizedISBN}`]?.details?.subtitle ||
			  "",
		tableOfContents:
			openLibrary[
				`ISBN:${normalizedISBN}`
			]?.details?.table_of_contents?.map((content, index) => ({
				number: index,
				title: content.title
			})) || [],
		title: googleBooks?.items?.[0]?.volumeInfo?.title?.includes(":")
			? googleBooks?.items?.[0]?.volumeInfo?.title
					?.split(":")
					.filter(Boolean)
					.map((t) => t.trim())[0]
			: googleBooks?.items?.[0]?.volumeInfo?.title ||
			  openLibrary[`ISBN:${normalizedISBN}`]?.details?.title ||
			  ""
	};

	await prisma.book.create({
		data: {
			authors: metadata.authors,
			coverURL: metadata.coverURL,
			description: metadata.description,
			isbn: normalizedISBN,
			subtitle: metadata.subtitle,
			title: metadata.title
		}
	});

	return NextResponse.json(metadata);
}

"use client";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Book = {
	authors: string[];
	coverURL: string;
	tableOfContents?: { number: number; title: string }[];
	title: string;
};

const BookPage = () => {
	const params = useParams();

	const router = useRouter();

	const [book, setBook] = useState<Book | null>(null);

	const isbn = params.isbn;

	useEffect(() => {
		const getISBNData = async () => {
			if (!isbn) {
				return;
			}

			try {
				const response = await fetch(`/api/openlibrary?isbn=${isbn}`);

				if (!response.ok) {
					throw new Error("Failed to fetch book data");
				}

				const data = await response.json();

				if (data) {
					console.log(data);

					const b = {
						authors:
							data[`ISBN:${isbn}`].details?.authors?.map(
								(author) => author.name
							) || [],
						coverURL:
							data[`ISBN:${isbn}`].thumbnail_url?.replace(
								"-S",
								"-L"
							) || "/pexels-jessbaileydesign-762687.jpg",
						tableOfContents: [
							{ number: 0, title: "General Discussion" },
							...(data[
								`ISBN:${isbn}`
							].details?.table_of_contents?.map(
								(chapter, index: number) => ({
									number: index + 1,
									title: chapter.title
								})
							) || [])
						],
						title: data[`ISBN:${isbn}`].details?.title || ""
					} as Book;

					setBook(b);
				}
			} catch (error) {}
		};

		getISBNData();
	}, [isbn]);

	return (
		<div className="bg-yellow-50 gap-4 grid grid-cols-10 grid-rows-10 h-screen items-center justify-center p-4 w-screen">
			<Header />
			<div className="col-span-10 gap-4 grid grid-cols-5 grid-rows-5 h-full row-span-8">
				<div className="bg-[#87A96B] border-zinc-800 border-3 col-span-1 gap-2 grid grid-cols-1 grid-rows-5 p-2 rounded-lg row-span-5">
					<div className="border-zinc-800 border-3 flex col-span-1 items-center justify-center overflow-hidden rounded-lg row-span-2 ">
						{book ? (
							<Image
								alt={""}
								className="h-full object-cover w-full"
								height={200}
								priority
								width={200}
								src={book.coverURL}
							/>
						) : (
							<p>Nada</p>
						)}
					</div>
					<div className="flex flex-col col-span-1 items-center justify-center row-span-3 text-zinc-800">
						<p>Title: {book?.title}</p>
						<p>Authors: {book?.authors.join(", ")}</p>
					</div>
				</div>
				<div className="col-span-4 gap-2 grid grid-cols-4 grid-rows-4 rounded-lg row-span-5">
					{book?.tableOfContents
						?.slice(0, 4)
						.map((chapter, index) => (
							<div
								className="bg-[#87A96B] border-zinc-800 border-3 col-span-4 flex flex-col justify-around pl-4 rounded-lg row-span-1 text-zinc-800"
								key={index}
								onClick={() =>
									router.push(
										`./${isbn}/chapter/${chapter.number}`
									)
								}
							>
								<p>Chapter {chapter.number}</p>
								<p>{chapter.title}</p>
							</div>
						))}
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default BookPage;

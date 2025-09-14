"use client";

import { isValidISBN } from "@/lib/isbn";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { CSSProperties, useEffect, useState } from "react";

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
	const [searchISBN, setSearchISBN] = useState("");

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
						tableOfContents: data[
							`ISBN:${isbn}`
						].details.table_of_contents.map(
							(chapter, index: number) => ({
								number: index + 1,
								title: chapter.title
							})
						),
						title: data[`ISBN:${isbn}`].details.title
					} as Book;

					console.log(b);

					setBook(b);
				}
			} catch (error) {}
		};

		getISBNData();
	}, [isbn]);

	return (
		<div className="bg-yellow-50 gap-4 grid grid-cols-10 grid-rows-10 h-screen items-center justify-center p-4 w-screen">
			<div className="bg-[#87A96B] border-zinc-800 border-3 col-span-10 flex h-full items-center justify-center rounded-lg row-span-1">
				<div className="flex gap-2 min-h-12 w-4/5">
					<input
						className="bg-yellow-50 border-zinc-800 border-3 flex-4 pl-4 rounded-lg text-zinc-800"
						onChange={(e) => {
							const value = e.target.value.replace(/\D/g, "");

							setSearchISBN(value);
						}}
						maxLength={13}
						placeholder="Enter an Search"
						style={
							{
								"--placeholder-color": "rgba(39,39,42, 80%)"
							} as CSSProperties
						}
						type="text"
						value={searchISBN}
					/>
					<button
						className="bg-yellow-50 border-3 flex-1 rounded-lg text-zinc-800"
						onClick={async () => {
							if (isValidISBN(searchISBN)) {
								router.push(`/book/${searchISBN}`);
							}
						}}
					>
						Search
					</button>
				</div>
			</div>
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
					{book?.tableOfContents?.slice(0, 4).map((chapter, index) => (
						<div
							className="bg-[#87A96B] border-zinc-800 border-3 col-span-4 flex flex-col justify-around pl-4 rounded-lg row-span-1 text-zinc-800"
							key={index}
						>
                            <p>Chapter {chapter.number}</p>
                            <p>{chapter.title}</p>
                        </div>
					))}
				</div>
			</div>
			<div className="bg-[#87A96B] border-zinc-800 border-3 col-span-10 h-full rounded-lg row-span-1"></div>
		</div>
	);
};

export default BookPage;

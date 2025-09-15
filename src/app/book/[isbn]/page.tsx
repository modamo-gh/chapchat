"use client";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Book = {
	authors: string[];
	coverURL: string;
	description: string;
	subtitle?: string;
	tableOfContents?: { number?: number; title: string }[];
	title: string;
};

const BookPage = () => {
	const params = useParams();

	const ref = useRef<HTMLDivElement | null>(null);

	const router = useRouter();

	const [book, setBook] = useState<Book | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [numberOfChatters, setNumberOfChatters] = useState(0);
	const [height, setHeight] = useState(0);

	useEffect(() => {
		setNumberOfChatters(Math.floor(Math.random() * 75) + 25);
	}, []);

	useEffect(() => {
		if (ref) {
			setHeight(ref.current?.offsetHeight || 0);
		}
	}, [ref]);

	const isbn = params.isbn;

	useEffect(() => {
		const getISBNData = async () => {
			if (!isbn) {
				return;
			}

			try {
				setIsLoading(true);

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
						description:
							data[`ISBN:${isbn}`].details?.description?.value ||
							"",
						subtitle: data[`ISBN:${isbn}`].details?.subtitle,
						tableOfContents: [
							{ title: "Pre Discussion" },
							...(data[
								`ISBN:${isbn}`
							].details?.table_of_contents?.map(
								(chapter, index: number) => ({
									number: index + 2,
									title: chapter.title
								})
							) || []),
							{
								title: "Post Discussion"
							}
						],
						title: data[`ISBN:${isbn}`].details?.title || ""
					} as Book;

					setBook(b);
				}
			} catch (error) {
			} finally {
				setIsLoading(false);
			}
		};

		getISBNData();
	}, [isbn]);

	return (
		<div className="bg-yellow-50 gap-4 grid grid-cols-10 grid-rows-10 h-screen items-center justify-center p-4 w-screen">
			<Header />
			<div className="col-span-10 gap-4 grid grid-cols-6 grid-rows-5 h-full row-span-8">
				<div
					className={`${
						isLoading && "animate-pulse bg-[]"
					} bg-center bg-cover border-zinc-800 border-3 col-span-2 gap-2 grid grid-cols-1 grid-rows-5 p-2 relative rounded-lg row-span-5`}
					style={{
						backgroundImage:
							!isLoading && book?.coverURL
								? `url(${book?.coverURL})`
								: "none"
					}}
				>
					{!isLoading && (
						<>
							<button className="absolute bg-[#87A96B] border-zinc-800 border-3 hover:cursor-pointer h-12 m-2 right-0 rounded-lg text-zinc-800 top-0 w-18 z-10">
								Join
							</button>
							<div className="absolute bg-gradient-to-t from-black from-25% inset-0" />
							<div className="absolute bottom-0 flex flex-col h-1/4 inset-x-0 justify-around m-2 p-2">
								<p className="text-2xl">
									{book?.title}: {book?.subtitle}
								</p>
								<p className="">{`By: ${book?.authors.join(
									", "
								)}`}</p>
								<p>Community Rating: 5/5</p>
								<p>{`${numberOfChatters} chatters this week`}</p>
								{/* <p>{book?.description}</p> */}
							</div>
						</>
					)}
				</div>
				<div
					className={`col-span-4 flex flex-col gap-2 overflow-y-auto ${
						book?.tableOfContents?.length >= 4 && "pr-2"
					} rounded-lg row-span-5`}
					id="chapterContainer"
					ref={ref}
				>
					{!isLoading &&
						book?.tableOfContents?.map((chapter, index) => (
							<div
								className={`${
									isLoading && "animate-pulse"
								} bg-[#87A96B] border-zinc-800 border-3 flex flex-col hover:cursor-pointer justify-evenly pl-4 rounded-lg text-zinc-800 text-lg`}
								key={index}
								onClick={() => {
									if (!isbn) {
										return;
									}

									router.push(
										`./${isbn}/chapter/${chapter.number}`
									);
								}}
								style={{ minHeight: `${height / 4}px` }}
							>
								{chapter.number && (
									<p>Chapter {chapter.number}</p>
								)}
								<p>{chapter.title}</p>
								<p className="text-base">10 comments</p>
							</div>
						))}
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default BookPage;

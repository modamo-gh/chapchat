"use client";

import { isValidISBN, normalizeISBN } from "@/lib/isbn";
import { useRouter } from "next/navigation";
import { CSSProperties, useState } from "react";

const ISBNSearch = ({ buttonColor }: { buttonColor: string }) => {
	const router = useRouter();

	const [isbn, setISBN] = useState("");

	return (
		<div className="flex gap-2 min-h-12 w-4/5">
			<input
				className="bg-yellow-50 border-zinc-800 border-3 flex-4 pl-4 rounded-lg text-zinc-800"
				onChange={(e) => {
					const value = e.target.value
						.replace(isbn.length === 9 ? /[^\dX]/gi : /\D/g, "")
						.toUpperCase();

					setISBN(value);
				}}
				maxLength={13}
				pattern={isbn.length === 10 ? `\d{9}(\d|X)"` : `\d{13}`}
				placeholder="Enter an ISBN"
				style={
					{
						"--placeholder-color": "rgba(39,39,42, 80%)"
					} as CSSProperties
				}
				type="text"
				value={isbn}
			/>
			<button
				className={`border-zinc-800 border-3 ${buttonColor} ${isValidISBN(isbn) ? "hover:cursor-pointer" : "hover:cursor-not-allowed"} flex-1 rounded-lg text-zinc-800`}
				onClick={async () => {
					if (isValidISBN(isbn)) {
						router.push(`/book/${normalizeISBN(isbn)}`);
					}
				}}
			>
				Search
			</button>
		</div>
	);
};

export default ISBNSearch;

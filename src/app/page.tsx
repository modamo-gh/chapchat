"use client";

import { CSSProperties, useState } from "react";

const Home = () => {
	const [isbn, setISBN] = useState("");

	return (
		<div className="bg-yellow-50 flex h-screen items-center justify-center w-screen">
			<div className="flex gap-2 min-h-12 w-4/5">
				<input
					className="border-zinc-800 border-3 flex-4 pl-4 rounded-lg text-zinc-800"
					onChange={(e) => setISBN(e.target.value)}
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
					className="bg-[#87A96B] border-3 flex-1 rounded-lg text-zinc-800"
					onClick={() => console.log(isbn)}
				>
					Search
				</button>
			</div>
		</div>
	);
};

export default Home;

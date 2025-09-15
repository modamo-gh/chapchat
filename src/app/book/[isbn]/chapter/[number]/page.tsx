"use client";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { faker } from "@faker-js/faker";
import Image from "next/image";
import { CSSProperties, useEffect, useState } from "react";

const ChapterPage = () => {
	const [content, setContent] = useState("");
	const [fakeComments, setFakeComments] = useState<
		{
			author: string;
			avatar: string;
			content: string;
			createdAt: Date;
			id: string;
			parentIndex: number;
		}[]
	>([]);

	useEffect(() => {
		const fc = Array.from({ length: 10 }).map(() => ({
			author: faker.internet.username(),
			avatar: faker.image.avatar(),
			content: faker.lorem.paragraph({ min: 1, max: 3 }),
			createdAt: faker.date.anytime(),
			id: faker.string.uuid(),
			parentIndex: Math.floor(Math.random() * 3)
		}));

		setFakeComments(fc);
	}, []);

	const getIndent = (index: number) => {
		return { paddingLeft: `${32 * index}px` };
	};

	return (
		<div className="bg-yellow-50 gap-4 grid grid-cols-10 grid-rows-10 h-screen items-center justify-center p-4 w-screen">
			<Header />
			<div className="col-span-10 gap-4 grid grid-cols-5 grid-rows-5 h-full row-span-8">
				<div className="bg-[#87A96B] border-zinc-800 border-3 col-span-1 gap-2 grid grid-cols-5 grid-rows-1 p-2 rounded-lg row-span-5"></div>
				<div className="col-span-4 gap-4 grid grid-cols-4 grid-rows-4 rounded-lg row-span-5">
					<div className="bg-[#87A96B] border-zinc-800 border-3 col-span-5 gap-2 grid grid-cols-5 grid-row-1 p-2 rounded-lg row-span-1">
						<textarea
							className="bg-yellow-50 border-zinc-800 border-3 col-span-4 row-span-1 rounded-lg overflow-y-auto p-4 resize-none text-wrap text-zinc-800"
							onChange={(e) => {
								const c = e.target.value;

								setContent(c);
							}}
							placeholder="Join the discussion"
							style={
								{
									"--placeholder-color": "rgba(39,39,42, 80%)"
								} as CSSProperties
							}
							value={content}
						/>
						<button
							className="bg-yellow-50 border-3 flex-1 rounded-lg text-zinc-800"
							onClick={() => {
								if (content.trim()) {
									setFakeComments((prev) => [
										...prev,
										{
											author: "me",
											avatar: faker.image.avatar(),
											content,
											createdAt: new Date(),
											id: faker.string.uuid(),
											parentIndex: Math.floor(
												Math.random() * 3
											)
										}
									]);
									setContent("");
								}
							}}
						>
							Submit
						</button>
					</div>
					<div className="bg-[#87A96B] border-zinc-800 border-3 col-span-5 flex flex-col gap-4 overflow-y-scroll p-4 rounded-lg row-span-4">
						{fakeComments.map((fakeComment, fakeCommentIndex) => (
							<div
								className="flex gap-2 text-zinc-800"
								key={fakeCommentIndex}
								style={getIndent(fakeComment.parentIndex)}
							>
								<div className="aspect-square border-zinc-800 border-3 flex h-12 rounded-lg overflow-hidden min-w-12">
									<Image
										alt=""
										className="aspect-square"
										src={fakeComment.avatar}
										height={48}
										width={48}
									/>
								</div>
								<div>
									<div className="flex gap-2">
										<p className="font-bold">
											{fakeComment.author}
										</p>
										<p>
											{fakeComment.createdAt.toString()}
										</p>
									</div>
									<p>{fakeComment.content}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default ChapterPage;

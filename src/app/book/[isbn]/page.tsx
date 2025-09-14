const BookPage = () => {
	return (
		<div className="bg-yellow-50 gap-4 grid grid-cols-10 grid-rows-10 h-screen items-center justify-center p-4 w-screen">
			<div className="bg-[#87A96B] border-zinc-800 border-3 col-span-10 h-full rounded-lg row-span-1"></div>
			<div className="col-span-10 gap-4 grid grid-cols-5 grid-rows-5 h-full row-span-8">
				<div className="bg-[#87A96B] border-zinc-800 border-3 col-span-1 rounded-lg row-span-5"></div>
				<div className="bg-[#87A96B] border-zinc-800 border-3 col-span-4 rounded-lg row-span-5"></div>
			</div>
            <div className="bg-[#87A96B] border-zinc-800 border-3 col-span-10 h-full rounded-lg row-span-1"></div>
		</div>
	);
};

export default BookPage;

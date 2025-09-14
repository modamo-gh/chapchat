import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

const ChapterPage = () => {
	return (
		<div className="bg-yellow-50 gap-4 grid grid-cols-10 grid-rows-10 h-screen items-center justify-center p-4 w-screen">
			<Header />
			<div className="col-span-10 gap-4 grid grid-cols-5 grid-rows-5 h-full row-span-8">
				<div className="bg-[#87A96B] border-zinc-800 border-3 col-span-1 gap-2 grid grid-cols-1 grid-rows-5 p-2 rounded-lg row-span-5"></div>
				<div className="border-zinc-800 border-3 col-span-4 gap-2 grid grid-cols-4 grid-rows-4 rounded-lg row-span-5"></div>
			</div>
			<Footer />
		</div>
	);
};

export default ChapterPage;

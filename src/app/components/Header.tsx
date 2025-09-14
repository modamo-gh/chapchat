import ISBNSearch from "./ISBNSearch";

const Header = () => {
	return (
		<div className="bg-[#87A96B] border-zinc-800 border-3 col-span-10 flex h-full items-center justify-center rounded-lg row-span-1">
			<ISBNSearch buttonColor="bg-yellow-50" />
		</div>
	);
};

export default Header;

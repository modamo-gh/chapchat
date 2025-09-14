"use client";

import ISBNSearch from "./components/ISBNSearch";

const Home = () => {
	return (
		<div className="bg-yellow-50 flex h-screen items-center justify-center w-screen">
			<ISBNSearch buttonColor="bg-[#87A96B]"/>
		</div>
	);
};

export default Home;

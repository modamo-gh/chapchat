import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			new URL("https://covers.openlibrary.org/**"),
			new URL("https://avatars.githubusercontent.com/**"),
			new URL("https://cdn.jsdelivr.net/**")
		]
	}
};

export default nextConfig;

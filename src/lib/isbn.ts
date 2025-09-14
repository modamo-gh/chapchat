export const isValidISBN = (isbn: string) => {
	const cleanedISBN =
		isbn.length > 10
			? isbn.replace(/\D/g, "")
			: isbn.replace(/[^\dX]/g, "");

	const isTenDigits = cleanedISBN.length === 10;
	const isThirteenDigits = cleanedISBN.length === 13;

	if (!isTenDigits && !isThirteenDigits) {
		return false;
	}

	if (isTenDigits) {
		let sum = 0;

		for (let i = 0; i < cleanedISBN.length; i++) {
			sum +=
				Number(cleanedISBN[i] === "X" ? 10 : cleanedISBN[i]) * (10 - i);
		}

		return sum % 11 === 0;
	}

	if (isThirteenDigits) {
		let sum = 0;

		for (let i = 0; i < cleanedISBN.length; i++) {
			sum += Number(cleanedISBN[i]) * (i % 2 === 0 ? 1 : 3);
		}

		return sum % 10 === 0;
	}
};

export const normalizeISBN = (isbn: string) => {
	if (isbn.length === 13) {
		return isbn;
	}

	isbn = `978${isbn.slice(0, 9)}`;

	let sum = 0;

	for (let i = 0; i < isbn.length; i++) {
		sum += Number(isbn[i]) * (i % 2 === 0 ? 1 : 3);
	}

	const checkDigit = 10 - (sum % 10);

	isbn += checkDigit === 10 ? 0 : checkDigit;

	return isbn;
};

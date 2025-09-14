export const isValidISBN = (isbn: string) => {
    const cleanedISBN = isbn.replace(/\D/g, "");
    
	const isTenDigits = cleanedISBN.length === 10;
	const isThirteenDigits = cleanedISBN.length === 13;

	if (!isTenDigits && !isThirteenDigits) {
		return false;
	}

	if (isTenDigits) {
		let sum = 0;

		for (let i = 0; i < cleanedISBN.length; i++) {
			sum += Number(cleanedISBN[i]) * (10 - i);
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

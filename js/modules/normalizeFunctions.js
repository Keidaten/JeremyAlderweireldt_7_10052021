///////////////////
//Remove doublons
/////////////////
function removeDuplicate(array) {
	const duplicateElements = [];
	const noDuplicate = array.filter((element) => {
		if (element in duplicateElements) {
			return false;
		}
		duplicateElements[element] = true;
		return true;
	});
	return noDuplicate;
}
///////////////////
//Normalize string
/////////////////
const normalizeString = (string) => {
	return string.toLocaleLowerCase().replace(/\s+/g, '');
};

export { removeDuplicate, normalizeString };

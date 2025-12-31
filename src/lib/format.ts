/**
 * Converts Devanagari numerals to English numerals and ensures a consistent Rupee symbol prefix.
 * Handles strings like "₹१४००", "१२००", or "Contact us".
 */
export const toEnglishNumerals = (str: string | undefined | null): string => {
    if (!str) return "";
    const s = str.toString();
    const devNums = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

    // 1. Replace all Devanagari digits with English ones
    let result = s.replace(/[०-९]/g, (match) => devNums.indexOf(match).toString());

    // 2. If the string contains numbers, ensure it has exactly one ₹ symbol at the start
    if (/\d/.test(result)) {
        const numericPart = result.replace(/[₹\s]/g, ''); // Remove existing symbols and spaces
        return `₹${numericPart}`;
    }

    return result;
};

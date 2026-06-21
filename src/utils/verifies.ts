/**
 * Brazil CPF validation
 * @param cpf - CPF to validate
 * @returns
 */
export const CPFVerify = (raw: string): boolean => {
    // Format validation
    if (!/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(raw)) return false;
    // Remove non-digits
    const cpf = raw.replace(/\D/g, '');
    const nums = cpf.split('').map((n) => parseInt(n, 10));

    // Exclude cases where all digits are the same
    if (new Set(nums).size === 1) return false;

    // Calculate first verification digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += nums[i] * (10 - i);
    }
    let remainder = sum % 11;
    const check1 = remainder < 2 ? 0 : 11 - remainder;
    if (check1 !== nums[9]) return false;
    // Calculate second verification digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += nums[i] * (11 - i);
    }
    remainder = sum % 11;
    const check2 = remainder < 2 ? 0 : 11 - remainder;
    if (check2 !== nums[10]) return false;

    return true;
};

/**
 * Password validation: Symbols + English + Numbers (must be mixed) (8-20 characters)
 * @param pwd - Password
 */
export const pwdVerify = (
    pwd: string,
): { len: boolean; letter: boolean; number: boolean; specialChar: boolean; result: boolean } => {
    const value = pwd.trim();

    let result = false;

    // Length requirement: 8-20, must contain letters, numbers, and special characters
    const lenResult = value.length >= 8 && value.length <= 20;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(value);

    // If requirements are not met, return result as false
    if (!lenResult || !(hasUpperCase || hasLowerCase) || !hasNumber || !hasSpecialChar) {
        result = false;
    } else result = true;

    return {
        // Is length valid
        len: lenResult,
        // Contains letters
        letter: hasUpperCase || hasLowerCase,
        // Contains numbers
        number: hasNumber,
        // Contains special characters
        specialChar: hasSpecialChar,
        // All criteria met
        result,
    };
};

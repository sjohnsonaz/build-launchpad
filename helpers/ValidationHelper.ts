export default class ValidationHelper {
    static testLength(password) {
        return password.length >= 8;
    }

    static testUpperCase(password) {
        return /[A-Z]/.test(password);
    }

    static testLowerCase(password) {
        return /[a-z]/.test(password);
    }

    static testNumeric(password) {
        return /\d/.test(password);
    }

    static testNonAlpha(password) {
        return /\W/.test(password);
    }

    static testPassword(password) {
        return ValidationHelper.testLength(password) && ValidationHelper.testUpperCase(password) && ValidationHelper.testLowerCase(password) && ValidationHelper.testNumeric(password) && ValidationHelper.testNonAlpha(password);
    }
}

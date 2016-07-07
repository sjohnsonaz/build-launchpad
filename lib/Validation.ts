function testLength(password) {
    return password.length >= 8;
}

function testUpperCase(password) {
    return /[A-Z]/.test(password);
}

function testLowerCase(password) {
    return /[a-z]/.test(password);
}

function testNumeric(password) {
    return /\d/.test(password);
}

function testNonAlpha(password) {
    return /\W/.test(password);
}

function testPassword(password) {
    return testLength(password) && testUpperCase(password) && testLowerCase(password) && testNumeric(password) && testNonAlpha(password);
}

export default {
    password: testPassword
};

const STATUS_CODES = {
    OK: 200,
    INTERNAL_SERVER_ERROR: 500,
    BAD_REQUEST: 401,
    NOT_FOUND: 400,
}
TIMEOUT_RESPONSE = 5000;
REQUIRED_VALIDATOR_TEXT = "Thiếu trường '$field' và trường này không được null hoặc rỗng.";
PASSWORD_VALIDATOR_TEXT = "Mật khẩu phải bao gồm ít nhất 6 ký tự, chữ in hoa, chữ in thường và số.";
EMAIL_VALIDATOR_TEXT = "Email không đúng định dạng.";
NUMBER_VALIDATOR_TEXT = "Trường '$field' phải là dạng số";
NOT_AVAILABLE_TEXT = "'$field' không tồn tại";


const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-sang-s-full-aytec-goalist-bi.com-@";
module.exports = {
    TIMEOUT_RESPONSE: TIMEOUT_RESPONSE,
    STATUS_CODES: STATUS_CODES,
    REQUIRED_VALIDATOR_TEXT: REQUIRED_VALIDATOR_TEXT,
    PASSWORD_VALIDATOR_TEXT: PASSWORD_VALIDATOR_TEXT,
    EMAIL_VALIDATOR_TEXT: EMAIL_VALIDATOR_TEXT,
    NUMBER_VALIDATOR_TEXT: NUMBER_VALIDATOR_TEXT,
    NOT_AVAILABLE_TEXT: NOT_AVAILABLE_TEXT,
    ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET
};

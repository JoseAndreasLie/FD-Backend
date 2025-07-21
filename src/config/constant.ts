// const userConstant = {
//     EMAIL_VERIFIED_TRUE: 1,
//     EMAIL_VERIFIED_FALSE: 0,
//     STATUS_ACTIVE: 1,
//     STATUS_INACTIVE: 0,
//     STATUS_REMOVED: 2,
// };



// export { userConstant };


const responseMessageConstant = {
    EMAIL_200_FOUND: 'Email Found',
    EMAIL_400_TAKEN: 'Email Taken',
    EMAIL_404_NOT_FOUND: 'Email Not Found',
    EMAIL_422_EMPTY: '"Email" is not allowed to be empty',
    EMAIL_422_INVALID_FORMAT: '"Email" must be in a valid email format',

    ID_422_EMPTY: '"id" is not allowed to be empty',
    ID_422_INVALID_FORMAT: '"id" must be in a valid UUID format',

    IS_ACTIVE_422_INVALID_VALUE: '"is_active" must be boolean',

    LOGIN_200_SUCCESS: 'Successfully Log In ',
    LOGIN_400_INCORRECT_EMAIL_OR_PASS: 'Incorrect Email or Password',

    OLD_PASSWORD_400_INCORRECT: 'Incorrect Old Password',

    PASSWORD_200_UPDATE_SUCCESS: '"Password" updated successfully',
    PASSWORD_400_UPDATE_FAILED: '"Password" update failed',
    PASSWORD_422_EMPTY: '"Password" is not allowed to be empty',
    PASSWORD_422_INVALID_FORMAT:
        '"Password" must be at least 8 characters, alphanumeric, at least 1 lowercase and at least 1 uppercase',

    PASSWORD_CONFIRMATION_422_NOT_MATCHING: '"Password" and "Confirmation Password" does not match',

    TOKEN_404_NOT_FOUND: 'Token Not Found',
    TOKEN_401_EXPIRED: 'Token Expired',
    TOKEN_400_INVALID: 'Invalid Token',
    TOKEN_200_REFRESHED: 'Access Token Refreshed',

    USER_200_DELETED: 'Successfully Deleted A Single User',
    USER_200_FETCHED_ALL: 'Successfully Fetched All Users',
    USER_200_FETCHED_SINGLE: 'Successfully Fetched A Single User',
    USER_200_UPDATED: 'Successfully Updated A Single User',
    USER_201_REGISTERED: 'Successfully Registered The User',
    USER_404_NOT_FOUND: 'User Not Found',
    USER_400_UPDATE_FAILED: 'User Update Failed',

    HTTP_401_UNAUTHORIZED: 'Please Authenticate',
    HTTP_403_FORBIDDEN: 'You Have No Permission',
    HTTP_502_BAD_GATEWAY: 'Something Went Wrong',

    TASK_200_CREATED: 'Task Created',
    TASK_200_FETCHED_SINGLE: 'Successfully Fetched A Sigle Task',
    TASK_200_FETCHED_ALL: 'Successfully Fetched All Task',
    TASK_400_NOT_FOUND: 'Task Not Found',

    VALIDATION: {
        empty: (field: string) => `"${field}" is not allowed to be empty`,
        required: (field: string) => `"${field}" is required`,
        string: (field: string) => `"${field}" should be string`,
        alphanumericWithSpaces: (field: string) =>
            `"${field}" must be alphanumeric and include spaces between words`,
        numeric: (field: string) => `"${field}" should be numeric`,
        invalidFormat: (field: string) => `"${field}" invalid format`,
        pattern: {
            contact: (field: string) =>
                `"${field}" must be numeric, 8-20 digits long, and not start with 0 or 62`,
            nik: (field: string) => `"${field}" must be numeric, and 16 digits long`,
        },
        maxLength: (field: string, length: number) =>
            `"${field}" length must be less than or equal to ${length} characters`,
        dateFormat: (field: string) => `"${field}" must be in format YYYY-MM-DD`,
        maxItems: (field: string, max: number) => `"${field}" maximum file is ${max}`,
    },

    FILE_201_CREATED: 'File created successfully',
    REIMBURSEMENT_201_CREATED: 'Reimbursement created successfully',
    REIMBURSEMENT_200_DELETED: 'Reimbursement deleted successfully',
    REIMBURSEMENT_200_FETCHED_SINGLE: 'Successfully Fetched A Single Reimbursement',

    PAYROLL_200_FETCHED_ALL: 'Successfully Fetched All Payroll',
    PAYROLL_200_FETCHED_SINGLE: 'Successfully Fetched A Single Payroll',
    PAYROLL_200_DELETED: 'Successfully Deleted A Single Payroll',
    PAYROLL_200_UPDATED: 'Successfully Updated A Single Payroll',
    PAYROLL_201_CREATED: 'Successfully Created A Single Payroll',
    PAYROLL_400_NOT_FOUND: 'Payroll Not Found',
    PAYROLL_400_NAME_ALREADY_EXISTS: 'Payroll Name Already Exists',
    PAYROLL_404_NOT_FOUND: 'Payroll Not Found',

    USER_ALLOWANCE_200_FETCHED_ALL: 'Successfully Fetched All User Allowance',
    USER_ALLOWANCE_200_FETCHED_SINGLE: 'Successfully Fetched A Single User Allowance',
    USER_ALLOWANCE_201_CREATED: 'User Allowance Created',
    USER_ALLOWANCE_200_UPDATED: 'Successfully Updated A Single User Allowance',
    USER_ALLOWANCE_200_DELETED: 'Successfully Deleted A Single User Allowance',
    USER_ALLOWANCE_400_NOT_FOUND: 'User Allowance Not Found',
    USER_ALLOWANCE_400_NAME_ALREADY_EXISTS: 'User Allowance Name Already Exists',

    HOLIDAY_201_CREATED: 'Event created successfully',
    HOLIDAY_200_DELETED: 'Event deleted successfully',
    HOLIDAY_200_FETCHED_SINGLE: 'Successfully Fetched A Single Event',

    SALARY_SLIP_200_FETCHED_SINGLE: 'Successfully Fetched A Single Salary Slip',
    SALARY_SLIP_200_FETCHED_ALL: 'Successfully Fetched All Salary Slip',
    ORGANIZATION_400_ALREADY_EXISTS: 'Organization Already Exists',
    ORGANIZATION_200_CREATED: 'Organization created successfully',
    ORGANIZATION_200_FETCHED_ALL: 'Successfully Fetched All Organizations',
    ORGANIZATION_200_FETCHED_SINGLE: 'Successfully Fetched A Single Organization',
    ORGANIZATION_200_UPDATED: 'Successfully Updated A Single Organization',
    ORGANIZATION_200_DELETED: 'Successfully Deleted A Single Organization',
    ORGANIZATION_404_NOT_FOUND: 'Organization Not Found',
};

export { responseMessageConstant };

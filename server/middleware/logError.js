export const logErrors = (error, req, res, next) => {
    const statusCode = error && error.hasOwnProperty("statusCode") ? error.statusCode : 500;
    const message = error && error.hasOwnProperty("message") ? error.message : '';
    console.error(`error statusCode:  ${statusCode} message: ${message} `)
    return res.status(statusCode).json({
        error: errMessageForClient(statusCode),
        details: message
    });
}

function errMessageForClient(statusCode) {
    switch (statusCode) {
        case 400:
            return 'Invalid request parameters';
        case 401:
            return 'Authorization required';
        case 403:
            return 'Forbidden';
        case 404:
            return 'Not found';
        case 500:
            return 'Internal Server Error';
        default:
            return 'Something went wrong!';
    }
}
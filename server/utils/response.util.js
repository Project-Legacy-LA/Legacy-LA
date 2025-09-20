class ResponseUtil {
    static success(res, data = null, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            status: 'success',
            message,
            data
        });
    }

    static error(res, message = 'Error occurred', statusCode = 400) {
        return res.status(statusCode).json({
            status: 'error',
            message
        });
    }

    static created(res, data = null, message = 'Resource created successfully') {
        return this.success(res, data, message, 201);
    }

    static unauthorized(res, message = 'Unauthorized') {
        return this.error(res, message, 401);
    }

    static forbidden(res, message = 'Forbidden') {
        return this.error(res, message, 403);
    }

    static notFound(res, message = 'Resource not found') {
        return this.error(res, message, 404);
    }
}

module.exports = ResponseUtil;

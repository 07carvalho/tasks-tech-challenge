class ServiceException(Exception):
    def __init__(self, message, code=None, status_code=400, details=None):
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)


class AuthenticationFailed(Exception):
    def __init__(self, message, code='authentication_failed', status_code=403, details=None):
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)

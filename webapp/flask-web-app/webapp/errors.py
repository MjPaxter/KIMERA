import json,datetime
from webapp import models as m, app


#######################################################
# Here we define the errors that can be raised by our
# Web Application.
#######################################################


class Message:
    """
    The standard message to return back to each
    communication that requires json data to be
    exchanged from client to server.
    """

    def __init__(self, error, data):
        self.error = error
        self.data = data

    def to_json(self,):
        data = {
            'error': self.error.to_json(),
            'data': json.dumps(self.data)
        }
        return json.dumps(data)


class Error(Exception):
    """
    The standard error composed of an error
    code and an error message. All customized
    errors derive from this class.
    """

    def __init__(self, error_code, error_message):
        self.error_code = error_code
        self.error_message = error_message

    def to_json(self,):
        data = {
            'error_code': self.error_code,
            'error_message': self.error_message
        }
        return json.dumps(data)
    
    def __str__(self):
        return "ERROR "+str(self.error_code)+"="+self.error_message


class NoError(Error):
    """
    Everything went fine.
    """

    def __init__(self, error_code=200, error_message="Request satisfied"):
        super().__init__(error_code, error_message)

    def __str__(self):
        return "SUCCESS "+str(self.error_code)+"="+self.error_message


class MethodNotAvailableError(Error):
    """
    This error is sent if the http method
    is not available/implemented for the
    a route
    """

    def __init__(self, error_code=501, error_message="The method is not available for this route"):
        super().__init__(error_code, error_message)


class IncorrectCredentialsError(Error):
    """
    This error is sent if submitting the wrong username
    or password to login.
    """

    def __init__(self, error_code=403, error_message="Wrong credentials"):
        super().__init__(error_code, error_message)
        
        
class IncorrectFormatError(Error):
    """
    This error is sent if submitting the wrong data.
    """

    def __init__(self, error_code=403, error_message="Wrong data"):
        super().__init__(error_code, error_message)


class CustomException(Exception):
    """Exception raised for handling input errors.

    Attributes:
        message -- explanation of the error
    """

    def __init__(self, message="Si è verificato un errore"):
        self.message = message
        super().__init__(self.message)
    
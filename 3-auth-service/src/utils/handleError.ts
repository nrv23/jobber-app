import BaseError from './customError';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError(error: any) {
    const customeError = new BaseError({
      message: error.message || 'Error desconocido',
      statusCode: error.response?.status || 500,
      commingFrom: 'gateway Service registerUser() Method'
    });

    return customeError;
  }

  export {
        handleError
  };
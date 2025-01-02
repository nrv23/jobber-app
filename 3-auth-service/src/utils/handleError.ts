import BaseError from './customError';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError(error: any) {
    const customeError = new BaseError({
      message: error.message || 'Error desconocido',
      statusCode: error.statusCode || 500,
      commingFrom: 'auth service '
    });

    return customeError;
  }

  export {
        handleError
  };
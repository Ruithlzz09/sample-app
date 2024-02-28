/**
 * An asynchronous function with optional payload that conditionally resolves or rejects based on the payload.
 * @param {*} payload - Optional payload to be passed to the function.
 *                      If payload is an object and has a 'resultType' attribute:
 *                        - If 'resultType' is set to 'reject', the promise is rejected with the null after the specified delay.
 *                        - If 'resultType' is not 'reject', the promise is resolved with null after the specified delay.
 *                      If payload is not an object, the promise is resolved with null after the specified delay.
 * @param {number} [delay=1000] - Optional delay in milliseconds before resolving the promise.
 * @returns {Promise<*>} - A promise indicating the completion of the asynchronous function with a resolved or rejected null value.
 */
const emptyAsyncFunction = (payload, delay = 1000) => {
  return new Promise((resolve, reject) => {
    // Check if payload is an object
    if (typeof payload === "object") {
      // Check if 'result' attribute is present and is set to 'reject'
      const resultType = payload?.resultType ?? "resolve";
      if (resultType === "reject") {
        // Reject the promise with the error or any value specified in payload.value, or null
        reject(null);
      } else {
        // Default behavior: Resolve with null after the specified delay (replace with your logic)
        setTimeout(() => {
          resolve(null);
        }, delay);
      }
    } else {
      // Default behavior: Resolve with null after the specified delay (replace with your logic)
      setTimeout(() => {
        resolve(null);
      }, delay);
    }
  });
};

/**
 * An empty synchronous function with an optional payload.
 * @param {*} payload - Optional payload to be passed to the function.
 * @returns {null} - The result of the synchronous function.
 */
const emptySyncFunction = (payload) => {
  // Implementation remains the same
  return null;
};

/**
 * A wrapper function that allows handling both synchronous and asynchronous functions.
 * @param {Function} method - The function to be wrapped.
 * @param {*} payload - Optional payload to be passed to the method.
 * @param {boolean} isAsync - Flag indicating whether the method is asynchronous.
 * @param {number} [delay=1000] - Optional delay in milliseconds before resolving the promise for asynchronous methods.
 * @returns {Promise<{data: *, error: *}>} - A promise resolving to an object containing the result or error.
 */
const mainWrapper = async (
  method = null,
  payload = {},
  isAsync = true,
  delay = 1000
) => {
  /**
   * Response object containing data and error properties.
   * @type {{data: *, error: *}}
   */
  let response = { data: null, error: null };

  // If method is not provided, use an empty function based on isAsync flag
  if (method == null) {
    method = isAsync ? emptyAsyncFunction : emptySyncFunction;
  }

  try {
    // Call the method, handling asynchronous nature based on isAsync flag
    const data = isAsync ? await method(payload, delay) : method(payload);
    response.data = data;
  } catch (error) {
    // Capture any errors that occur during method execution
    console.log(error)
    response.error = error;
  } finally {
    // Return the response object
    return response;
  }
};

module.exports = { emptyAsyncFunction, emptySyncFunction, mainWrapper };

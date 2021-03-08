# **General Functions**

## **_Return JSON Endpoint Not Supported_**

### general.endpointNotSupported

- Return a template JSON specifiying that the Endpoint requested is not supported

  ```javascript
  general.endpointNotSupported(method = null, key = 'message', message = 'This endpoint does not support this method requests');
  ```

- Example
  
  ```javascript
  general.endpointNotSupported('post', 'error', 'Endpoint not supported');
  // return
  {
      method : 'post',
      // property key is called error because that's what was passed as second parameters, passing x will make the key called x
      error: 'Endpoint not supported'
  }
  ```

### general.constructResponse

- Return a template JSON specifiying the status of an operation

  ```javascript
  general.constructResponse(success = true, code = 200, message = null, body = null, otherAttributes = null);
  ```

- Example
  
  ```javascript
  // some error object that came back from calling other service
  const errorFromOtherService = {errorMessage: 'User Already Exist'}
  // extra information we got from the responding service, and we want to pass it to our resopnse
  const previousUserIdInThatService = 123;
  // setting an object containing the extra information we want to pass with the error
  const otherAttributes = {userId: perviousUserIdInThatService}

  // the following function will be called in the catch block for examples and returned to the calling function to indicate the error occuring and its details
  await general.constructResponse(false, 404, 'Can not add a new user', errorFromOtherService, otherAttributes);
  // return
  {
      success: false,
      code: 404,
      message: 'Can not add a new user'
      body: {errorMessage: 'User Already Exist'}
      otherAttributes: {userId: 123}
  }
  ```

### general.sleep

- Halt the execution of the program for the amount specified in milliseconds

  ```javascript
  general.sleep(milliseconds = 1000);
  ```

- Example
  
  ```javascript
  await general.sleep(3000);
  // Stops execution for 3 seconds
  ```

### general.hitInHouseEndpoint

- Send a request to an endpoint in the current server

  ```javascript
  general.hitInHouseEndpoint(endpoint = '', method = 'get', body = {});
  ```

- Example
  
  ```javascript
  await general.hitInHouseEndpoint(endpoint = '/user/add', method = 'post', body = {name: 'Amjad'});
  // return
  {
      success: true,
      code: 200,
      message: 'Successfully hit the endpoint /user/add',
      // whatever is returned from the endpoint hit
      body: {
          userId: 123
          name: 'Amjad'
      }
  }
  ```

### general.hitURL

- Send a request to an external url

  ```javascript
  general.hitURL(url, method = 'get', body = {});
  ```

- Example
  
  ```javascript
  await general.hitURL('https://example.com/user/add', method = 'post', body = {name: 'Amjad'});
  // return
  {
      success: true,
      code: 200,
      message: 'Successfully hit https://example.com/user/add',
      // whatever is returned from the url hit
      body: {
          userId: 123
          name: 'Amjad'
      }
  }
  ```

  ### general.performActionForSubArrays

- Send a request to an external url

  ```javascript
  general.performActionForSubArrays(action, array, desiredLength = 1, parameters = null,sleepPeriodInMilliseconds = 1000);
  ```

- Example
  
  ```javascript
  await util.funcs.g.performActionForSubArrays((chunck, parameters) => {
      console.log(chunck[0])
      console.log(parameters.seperator)
  }, [1, 2, 3, 4], desiredLength = 1, {seperator: '---'}, 1000);
  // Prints the following output and each chunk will appear after a second of the previous
  1
  ---
  2
  ---
  3
  ---
  4
  ---
  
  ```
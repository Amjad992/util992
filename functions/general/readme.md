# **General Functions**

[Go Back to Home](https://github.com/Amjad992/util992)

## **_Return JSON Endpoint Not Supported_**

### general.endpointNotSupported

- Return a template JSON specifiying that the Endpoint requested is not supported

  ```javascript
  general.endpointNotSupported(
    (method = null),
    (key = 'message'),
    (message = 'This endpoint does not support this method requests')
  );
  ```

- Example

  ```javascript
  general.endpointNotSupported('post', 'error', 'Endpoint not supported');
  // returns
  {
      method : 'post',
      // property key is called error because that's what was passed as second parameters, passing x will make the key called x
      error: 'Endpoint not supported'
  }
  ```

### general.constructResponse

- Return a template JSON specifiying the status of an operation

  ```javascript
  general.constructResponse(
    (success = true),
    (code = 200),
    (message = null),
    (body = null),
    (otherAttributes = null)
  );
  ```

- Example

  ```javascript
  // some error object that came back from calling other service
  const errorFromOtherService = {errorMessage: 'User Already Exist'}
  // extra information we got from the responding service, and we want to pass it to our resopnse
  const previousUserIdInThatService = 123;
  // setting an object containing the extra information we want to pass with the error
  const otherAttributesObj = {extraObj: {userId: perviousUserIdInThatService}, userName: 'Amjad992'}}

  // the following function will be called in the catch block for examples and returned to the calling function to indicate the error occuring and its details
  // notice that extraObj has to be an object in order to be shows e.g. {extraObj: {userId: 123}}
  await general.constructResponse(false, 404, 'Can not add a new user', errorFromOtherService, otherAttributesObj);
  // returns
  {
      success: false,
      code: 404,
      message: 'Can not add a new user'
      body: {
          errorMessage: 'User Already Exist'
      }
      extraObj: {
          userId: 123
      },
      userName: 'Amjad992'
  }
  ```

### general.sleep

- Halt the execution of the program for the amount specified in milliseconds

  ```javascript
  general.sleep((milliseconds = 1000));
  ```

- Example

  ```javascript
  await general.sleep(3000);
  // Stops execution for 3 seconds
  ```

### general.hitInHouseEndpoint

- Send a request to an endpoint in the current server
- if the method is get, the body will be stringified before sending

  ```javascript
  general.hitInHouseEndpoint((endpoint = ''), (method = 'get'), (body = {}));
  ```

- Example

  ```javascript
  await general.hitInHouseEndpoint(endpoint = '/user/add', method = 'post', body = {name: 'Amjad'});
  // returns
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
- if the method is get, the body will be stringified before sending

  ```javascript
  general.hitURL(url, (method = 'get'), (body = {}));
  ```

- Example

  ```javascript
  await general.hitURL('https://example.com/user/add', method = 'post', body = {name: 'Amjad'});
  // returns
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

- Perform an action multiple times (just perform actions and doesn't return anything)

  ```javascript
  general.performActionForSubArrays(
    action,
    array,
    (desiredLength = 1),
    (parameters = null),
    (sleepPeriodInMilliseconds = 1000)
  );
  ```

- Example

  ```javascript
  await util.funcs.g.performActionForSubArrays((chunck, parameters) => {
      console.log(chunck[0])
      console.log(parameters.separator)
  }, [1, 2, 3, 4], 1, {separator: '---'}, 1000);
  // Prints the following output and each chunk will appear after a second of the previous
  [ 1, 2 ]
  ---
  [ 3, 4 ]
  ---
  ```

  ### general.performActionRepeatedly

- Perform an action without blocking until the checking function used to check the response return true, or the maximum number of tries reached.
- This will return whatever the response is in case of success (decided by checking function), or will return the final failure response in case of failure
- This is a promise and can use with either await or .then()

  ```javascript
  general.performActionRepeatedly(
    action,
    checkFunction,
    (attempts = 1),
    (parameters = null),
    (sleepPeriodInMilliseconds = 1000)
  );
  ```

- Example 1

  ```javascript
  await util.funcs.g.performActionRepeatedly((parameters) => {
      console.log('Call API');
      const callResponse = someCalledFunctionOrAPI(parameters.valueNeeded);
      console.log(parameters.separator)
      // e.g. callResponse = {status: 'fail', message: 'some error message from the API'}
      return callResponse;
  }, (response) => {
    if (response.status == 'success') return true;
    else return false
  }, 3, {valueNeeded: 'some value', separator: '---'}, 1000);
  // Prints the following output and each try will appear after a second of the previous
  Call API
  ---
  Call API
  ---
  Call API
  ---
  // Will also return the following since the call to API failed in the 3 times
  {
    success: false,
    code: 400,
    message: 'Failed performing an action',
    body:{
      status: 'fail',
      message: 'some error message from the API'
    },
    attempts: 3
  }
  ```

- Example 2

  ```javascript
  await util.funcs.g.performActionRepeatedly((parameters) => {
      console.log('Call API');
      const callResponse = someCalledFunctionOrAPI(parameters.valueNeeded);
      console.log(parameters.separator)
      // let's assume that on first attempt response was
      // call callResponse = {status: 'fail', message: 'some error message from the API'}
      // while on second attempt it was
      // e.g. callResponse = {status: 'success', message: 'some message'}
      return callResponse;
  }, (response) => {
    if (response.status == 'success') return true;
    else return false
  }, 3, {valueNeeded: 'some value', separator: '---'}, 1000);
  // Prints the following output and each try will appear after a second of the previous
  Call API
  ---
  Call API
  ---
  Call API
  ---
  // Will also return the following since the call to API call successed after 2 attempts
  {
    success: false,
    code: 200,
    message: 'Successfully performed action',
    body:{
      status: 'success',
      message: 'some message'
    },
    attempts: 2
  }
  ```

  ### general.isArray

- Check if the object is an array or not

  ```javascript
  general.isArray(object);
  ```

- Example

  ```javascript
  await general.isArray([]);
  // returns true
  ```

  ### general.isObject

- Check if the object is an object or not

  ```javascript
  general.isObject(object);
  ```

- Example

  ```javascript
  await general.isObject({});
  // returns true
  ```

  ### general.isFunction

- Check if the object is a function or not

  ```javascript
  general.isFunction(object);
  ```

- Example

  ```javascript
  await general.isFunction(()=>{return true}));
  // returns true
  ```

  ### general.isNumber

- Check if the object is a number or not

  ```javascript
  general.isNumber(object);
  ```

- Example

  ```javascript
  await general.isNumber(1);
  // returns true
  ```

  ### general.isString

- Check if the object is a string or not

  ```javascript
  general.isString(object);
  ```

- Example

  ```javascript
  await general.isString('Hello');
  // returns true
  ```

  ### general.isBoolean

- Check if the object is a boolean or not

  ```javascript
  general.isBoolean(object);
  ```

- Example

  ```javascript
  await general.isBoolean(true);
  // returns true
  ```

  ### general.isEmptyArray

- Check if the object is an empty array or not

  ```javascript
  general.isEmptyArray(object);
  ```

- Example

  ```javascript
  await general.isEmptyArray([]);
  // returns true
  ```

  ### general.isEmptyString

- Check if the object is an empty string or not

  ```javascript
  general.isArray(object);
  ```

- Example

  ```javascript
  await general.isArray('');
  // returns true
  ```

  ### general.isEmptyObject

- Check if the object is an empty object or not

  ```javascript
  general.isEmptyObject(object);
  ```

- Example

  ```javascript
  await general.isEmptyObject({});
  // returns true
  ```

///

### general.generateString

- Generate a string with variable parts inside it

  ```javascript
  general.generateString(string, variables, values);
  ```

- Example

  ```javascript
  await general.generateString(
    'My Name is {firstName} {lastName}',
    ['firstName', 'lastName'],
    ['John', 'Doe']
  );
  // returns the string: 'My Name is John Doe'
  ```

### general.generateString

- Filter the elements of a nested JSON object or array by the value of a specific key inside each element

  ```javascript
  general.filterJSONElementsByKeyValue(object, key, value);
  ```

- Example

  ```javascript
  await general.filterJSONElementsByKeyValue(
    {
      emp1: {name: 'Amjad', position: 'Programmer'},
      emp2: {name: 'Sarah', position: 'Business Manager'},
      emp3: {name: 'Hussam', position: 'Programmer'},
    },
    'position',
    'Programmer'
  );
  // returns
  [
    {key: 'emp1', element: {name: 'Amjad', position: 'Programmer'}},
    {key: 'emp3', element: {name: 'Hussam', position: 'Programmer'}},
  ];
  ```

  ```javascript
  await general.filterJSONElementsByKeyValue(
    [
      {name: 'Amjad', position: 'Programmer'},
      {name: 'Sarah', position: 'Business Manager'},
      {name: 'Hussam', position: 'Programmer'},
    ],
    'position',
    'Programmer'
  );
  // returns
  [
    {key: '0', element: {name: 'Amjad', position: 'Programmer'}},
    {key: '2', element: {name: 'Hussam', position: 'Programmer'}},
  ];
  ```

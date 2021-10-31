# **Jotform Functions**

[Go Back to Home](https://github.com/Amjad992/util992)

## There are some required values to set before using Jotform functions

You can pass the required values on each function call, or configure it globally using the following

```javascript
config.jotform.apiKey('123'); // Default value is null
config.jotform.formId('987'); // Default value is false
config.jotform.isHipaa(true); // Default value is false
```

## **_Getting Forms_**

### get.form

- Return a specific form from Jotform
  ```javascript
  get.submission(formId, apiKey, isHipaa);
  ```
- Example
  ```javascript
  await get.submission('987654321', undefined, true)
  // returns
  {
    success: true,
    code: 200,
    message: 'Retrieved form 987654321 from Jotform',
    body: {
        id: '987654321',
        username: 'amjad992',
        title: 'Contact Us',
        height: '539',
        status: 'ENABLED',
        created_at: '2021-04-07 19:17:01',
        updated_at: '2021-04-18 18:59:01',
        last_submission: null,
        new: '0',
        count: '0',
        type: 'LEGACY',
        favorite: '0',
        archived: '0',
        url: 'https://hipaa.jotform.com/987654321'
    }
  }
  ```

### get.forms

- Return an array of forms
  ```javascript
  get.forms(limit, offset, apiKey, isHipaa);
  ```
- Example

  ```javascript
  await get.forms()
  // returns all forms
  await get.forms(10, 20)
  // returns the forms from 21 to 30
  {
    success: true,
    code: 200,
    message: 'Retrieved 10 forms in the account',
    body: {
      [
        {
          id: '987654321',
          username: 'amjad992',
          title: 'Contact Us',
          height: '539',
          status: 'ENABLED',
          created_at: '2021-04-07 19:17:01',
          updated_at: '2021-04-18 18:59:01',
          last_submission: null,
          new: '0',
          count: '0',
          type: 'LEGACY',
          favorite: '0',
          archived: '0',
          url: 'https://hipaa.jotform.com/987654321'
        },
        ....
      ]
    }
  }
  ```

## **_Getting Submissions_**

### get.submission

- Return a specific submission from Jotform form
  ```javascript
  get.submission(submissionId, apiKey, isHipaa);
  ```
- Example
  ```javascript
  await get.submission('123456789', undefined, true)
  // returns
  {
    success: true,
    code: 200,
    message: 'Retrieved submission 123456789 of Jotform form 987654321',
    body: {
        id: '5012088400321322831',
        form_id: '211843801846457',
        ip: '192.168.10.1',
        created_at: '2021-07-04 07:54:00',
        status: 'ACTIVE',
        new: '1',
        flag: '0',
        notes: '',
        updated_at: null,
        answers: {
            '5': {
                name: 'name',
                order: '3',
                text: 'Employee Name',
                type: 'control_dropdown',
                answer: 'Amjad Majed'
            },
            '6': {
                name: 'email',
                order: '3',
                text: 'Employee Email',
                type: 'control_email',
                answer: 'contact@amjadmajed.com'
            },
        }
    }
  }
  ```

### get.submissions

- Return an array of submissions
  ```javascript
  get.submissions(limit, offset, formId, apiKey, isHipaa);
  ```
- Example

  ```javascript
  await get.submissions()
  // returns all submissions
  await get.submissions(10, 20)
  // returns the submissions from 21 to 30
  {
    success: true,
    code: 200,
    message: 'Retrieved 10 submissions for form with id 987',
    body: {
      [
        {
          id: '5012088400321322831',
          form_id: '987',
          ip: '192.168.10.1',
          created_at: '2021-07-04 07:54:00',
          status: 'ACTIVE',
          new: '1',
          flag: '0',
          notes: '',
          updated_at: null,
          answers: {
              '5': {
                name: 'name',
                order: '3',
                text: 'Employee Name',
                type: 'control_dropdown',
                answer: 'Amjad Majed'
              },
              '4': {
                name: 'address',
                order: '3',
                text: 'Address',
                type: 'control_address'
                answer: {addr_line1: '8th avenue'}
              },
          }
        },
        ....
      ]
    }
  }
  ```

  ### get.submissionsByFieldValue

- Return an array of submissions that has a specific field value
  ```javascript
  get.submissionsByFieldValue(
    fieldValue,
    fieldId,
    subFieldId,
    formId,
    apiKey,
    isHipaa
  );
  ```
- Example
  ```javascript
  await get.submissionsByFieldValue('7th avenue', 4, 'addr_line1', undefined, undefined, undefined)
  // returns
  {
    success: true,
    code: 200,
    message: 'Retrieved submissions with value 7th avenue in filed with id 4  and sub field id addr_line1',
    body: {
      [
        {
          id: '5012088400321322831',
          form_id: '987',
          ip: '192.168.10.1',
          created_at: '2021-07-04 07:54:00',
          status: 'ACTIVE',
          new: '1',
          flag: '0',
          notes: '',
          updated_at: null,
          answers: {
              '5': {
                name: 'name',
                order: '3',
                text: 'Employee Name',
                type: 'control_dropdown',
                answer: 'Amjad Majed'
              },
              '4': {
                name: 'address',
                order: '3',
                text: 'Address',
                type: 'control_address'
                answer: {addr_line1: '7th avenue'}
              },
          }
        },
        {
          id: '5012088400321322831',
          form_id: '987',
          ip: '192.168.10.1',
          created_at: '2021-07-07 02:54:00',
          status: 'ACTIVE',
          new: '1',
          flag: '0',
          notes: '',
          updated_at: null,
          answers: {
              '5': {
                name: 'name',
                order: '3',
                text: 'Employee Name',
                type: 'control_dropdown',
                answer: 'Hussam Majed'
              },
              '4': {
                name: 'address',
                order: '3',
                text: 'Address',
                type: 'control_address'
                answer: {addr_line1: '7th avenue'}
              },
          }
        }
      ]
    }
  }
  ```

## **_Setting Submissions_**

### set.submission

- Create a new submission
  ```javascript
  set.submission(submissionFieldsObj, formId, apiKey, isHipaa);
  ```
- Example

  ```javascript
  await set.submission({
    6: 'contact@amjadmajed.com',
    7: {
      addr_line1: '7th avenue',
      city: 'New York'
    }
  }, '987', undefined, true)
  // returns
  {
    success: true,
    code: 200,
    message: 'Added submission successfully to form 987',
    body: {
        submissionId: '12345'
    }
  }
  ```

## **_Updating Submissions_**

### update.submission

- update an existing submission
  ```javascript
  update.submission(submissionFieldsObj, submissionId, apiKey, isHipaa);
  ```
- Example
  ```javascript
  await update.submission({
    6: 'contact@amjadmajed.com',
    7: {
      addr_line1: '8th avenue',
      state: 'New York'
    }
  }, '123', undefined, true)
  // returns
  {
    success: true,
    code: 200,
    message: 'Added submission successfully to form 987',
    body: {
        submissionId: '123'
    }
  }
  ```

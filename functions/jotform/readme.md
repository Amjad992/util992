# **Jotform Functions**

[Go Back to Home](https://github.com/Amjad992/util992)

## There are some required values to set before using Jotform functions

You can pass the required values on each function call, or configure it globally using the following

```javascript
config.jotform.apiKey('123'); // Default value is null
config.jotform.formId('987'); // Default value is false
config.jotform.isHipaa(true); // Default value is false
```

## **_Getting Submissions_**

### get.submission

- Return a specific submission from Jotform form
  ```javascript
  get.submission{submissionId, apiKey, isHipaa}
  ```
- Example
  ```javascript
  await get.submission{'123456789', undefined, true}
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

### get.submissionsByFieldValue

- Return an array of submissions that has a specific field value
  ```javascript
  get.submissionsByFieldValue{fieldValue, fieldId, subFieldId, formId, apiKey, isHipaa}
  ```
- Example
  ```javascript
  await get.submissionsByFieldValue{'7th avenue', 4, 'addr_line1', undefined, undefined, undefined}
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
              '6': {
                  name: 'email',
                  order: '4',
                  text: 'Employee Email',
                  type: 'control_email',
                  answer: 'contact@amjadmajed.com'
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
              '6': {
                  name: 'email',
                  order: '4',
                  text: 'Employee Email',
                  type: 'control_email',
                  answer: 'test@amjadmajed.com'
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
  set.submission{submissionFieldsObj, formId, apiKey, isHipaa}
  ```
- Example
  ```javascript
  await set.submission{{
    6: 'contact@amjadmajed.com',
    7: {
      addr_line1: '7th avenue',
      city: 'New York'
    }
  }, undefined, undefined, true}
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

# **Jotform Functions**

[Go Back to Home](https://github.com/Amjad992/util992)

## There are some required values to set before using Jotform functions

You can pass the required values on each function call, or configure it globally using the following

```javascript
config.jotform.apiKey('123'); // Default value is null
config.jotform.isHipaa(true); // Default value is false
```

## **_Getting Submission_**

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
        ip: '134.35.233.230',
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

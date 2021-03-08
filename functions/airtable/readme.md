# **Airtable Functions**

## There are some required values to set becore using Airtable functions

You can pass the required values on each function call, or configure it globaly using the following

```javascript
config.airtable.apiKey('123'); // Default value is null
config.airtable.baseURL('https://airtable.example.com'); // Default value is https://api.airtable.com/v0/
config.airtable.baseId('app123'); // Default value is null
config.airtable.apiKey(['Table 1', 'Table 2']); // Default value is []
```

## **_Getting Records_**

### get.records

- Return a specific number of records
- Return all records if numberOfRecords is not passed
  ```javascript
  get.records{tableName, numberOfRecords, offset = undefined, formula = undefined, apiKey, baseURL, baseId}
  ```
- Example
  ```javascript
  await get.records{'Leads', 2, undefined, undefined, undefined, undefined, undefined}
  // returns
  {
    success: true,
    code: 200,
    message: 'Retrieved 2 records from table Leads in airtable',
    body: [
        {
            id: 'recIwaPtoYNNZFS0E',
            fields: {
                Name: "Amjad"
                Notes: "New"
            },
            createdTime: '2021-03-08T09:31:39.000Z'
        },
        {
            id: 'recYUQdeF9mk4I9Aw',
            fields: {
                Name: "Sarah"
                Notes: "Contacted"
            },
            createdTime: '2021-03-08T09:31:43.000Z'
        }
    ]
  }
  ```

### get.table

- Return all the records in a table
  ```javascript
  get.table{tableName, formula = undefined, apiKey, baseURL, baseId}
  ```
- Example

  ```javascript
  await get.table{'Leads', undefined, undefined, undefined, undefined}
  // returns
    {
        success: true,
        code: 200,
        message: 'Retrieved all 2 records from table Leads airtable',
        body: [
            {
                id: 'recYUQdeF9mk4I9Aw',
                fields: {
                    Name: "Amjad",
                    Status: "New"
                },
                createdTime: '2021-03-08T09:31:43.000Z'
            },
            {
                id: 'recYUYNNF9mk4Kd83',
                fields: {
                    Name: "Sarah",
                    Status: "Contacted"
                },
                createdTime: '2021-03-08T09:31:44.000Z'
            }

        ]
    }
  ```

### get.base

- Return all the records in a base
  ```javascript
  get.base{tablesArray, apiKey, baseURL, baseId}
  ```
- Example
  ```javascript
  await get.base{['Leads, Assets'], undefined, undefined, undefined}
  // returns
    {
        "success": true,
        "code": 200,
        "message": "Retrieved Assets,Leads tables records from airtable",
        "body": {
            "Leads": [
                {
                    "id": "rec0kYwc5k7UZfxbM",
                    fields: {
                        Name: 'Amjad',
                        Status: 'New'
                    },
                    "createdTime": "2021-03-08T14:37:08.000Z"
                },
                {
                    "id": "rec6aOZpYooe7rIzl",
                    fields: {
                        Name: 'Sarah',
                        Status: 'Contacted'
                    },
                    "createdTime": "2021-03-08T14:37:08.000Z"
                }
            ],
            "Assets": []
        }
    }
  ```

### get.baseRecoresIds

- Return all the records in a base
  ```javascript
  get.baseRecoresIds{tablesArray, apiKey, baseURL, baseId}
  ```
- Example
  ```javascript
  await get.baseRecoresIds{['Leads, Assets'], undefined, undefined, undefined}
  // returns
  {
      success: true,
      code: 200,
      message: 'Retrieved Leads, Assets tables records ids from airtable',
      body: {
        Leads: [
            'rec0kYwc5k7UZfxbM',
            'rec6aOZpYooe7rIzl'
        ],
        Assets: []
      }
  }
  ```

## **_Setting Records_**

### set.records

- Set the records passed into airtable
- The records have to be in JSON format, and the keys are identical to the column name in Airtable
  ```javascript
  set.records{tableName, recordsArray, apiKey, baseURL, baseId}
  ```
- Example
  ```javascript
  set.records(
      "Leads",
      [
          {
              Name: "Amjad",
              Status: "New"
          },
          {
              Name: "Sarah",
              Status: "Contacted"
          }
      ],
      undefined,
      undefined,
      undefined
  );
  // returns
    {
        success: true,
        code: 200,
        message: "Successfully updated 2 records in table Users",
        body: [
            {
                id: "recp6Bw2EmFOomPa8",
                fields: {
                    Name: "Amjad"
                    Notes: "New"
                },
                createdTime: "2021-03-08T17:09:25.000Z"
            },
            {
                id: "recXud4Kycs47lRsh",
                fields: {
                    Name: "Sarah"
                    Notes: "Contacted"
                },
                createdTime: "2021-03-08T17:09:25.000Z"
            }
        ]
    }
  ```

## **_Updating Records_**

### update.records

- Update the records passed into airtable
- The records have to be in JSON format, with id and fields attributes that is also a JSON its keys are identical to the column name in Airtable
  ```javascript
  set.records{tableName, recordsArray, apiKey, baseURL, baseId}
  ```
- Example

  ```javascript
  update.records(
    "Leads",
    [
        {
            id: "rec1Wpjs0P778fCSu",
            fields: {
                Name: "Amjad",
                Status: "New"
            },
        },
        {
            id: "rec0DRaNj0BA88EE4",
            fields: {
                Name: "Sarah",
                Status: "Contacted"
            },
        },
    ],
    undefined,
    undefined,
    undefined
  );
  // returns
  {
    success: true,
    code: 200,
    message: "Successfully updated 2 records in table Users",
    body: [
        {
            id: "rec1Wpjs0P778fCSu",
            fields: {
                Name: "Amjad",
                Status: "New"
            },
            createdTime: "2021-03-08T16:11:05.000Z"
        },
        {
            id: "rec0DRaNj0BA88EE4",
            fields: {
                Name: "Sarah",
                Status: "Contacted"
            },
            createdTime: "2021-03-08T16:11:05.000Z"
        }
    ]
  }
  ```

## **_Deleting Records_**

### clear.records

- Remove all the records with ids passed in the recordsIdsArray parameter
- Return all records if numberOfRecords is not passed
  ```javascript
  clear.records{tableName, recordsIdsArray, apiKey, baseURL, baseId}
  ```
- Example
  ```javascript
  await clear.records{"Leads", [ "rec3t6J5C9NHYoIwH", "recfIysq0vDpCWZjr", "rechUoMSTe87XFwID" ], undefined, undefined, undefined}
  // returns
  {
    success: true,
    code: 200,
    message: "Deleted 3 records from table Leads",
    body: [
        {
            deleted: true,
            id: "rec3t6J5C9NHYoIwH"
        },
        {
            deleted: true,
            id: "recfIysq0vDpCWZjr"
        },
        {
            deleted: true,
            id: "recfIysq0vDpCWZjr"
        }
    ]
  }
  ```

### clear.table

- Remove all the records of the table passed
  ```javascript
  clear.table{tableName, apiKey, baseURL, baseId}
  ```
- Example
  ```javascript
  await clear.table{"Leads", undefined, undefined, undefined}
  // returns
  {
    success: true,
    code: 200,
    message: "Deleted all 2 records of table Leads",
    body: [
        {
            deleted: true,
            id: "rec0VzHOEYOcGvgaL"
        },
        {
            deleted: true,
            id: "rec0zTK2VByIbPCQ6"
        }
    ]
  }
  ```

### clear.base

- Remove all the records with ids passed in the recordsIdsArray parameter
- Return all records if numberOfRecords is not passed
  ```javascript
  clear.base{tablesArray, apiKey, baseURL, baseId}
  ```
- Example

  ```javascript
  await clear.base{["Assets","Leads"], undefined, undefined, undefined}
  //return
  {
    success: true,
    code: 200,
    message: "Deleted Assets,Leads tables records in airtable",
    body: {
        Assets: {
            success: true,
            code: 200,
            message: "Table Assets is empty",
            body: []
        },
        Leads: {
            success: true,
            code: 200,
            message: "Deleted all 2 records of table Leads",
            body: [
                {
                    deleted: true,
                    id: "rec4MF3Nay69YjlBs"
                },
                {
                    deleted: true,
                    id: "rec4aoZ3pMhMf2YsB"
                }
            ]
        }
    }
  }
  ```

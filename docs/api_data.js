define({ "api": [
  {
    "type": "delete",
    "url": "notecard/:id",
    "title": "DELETE Notecard",
    "name": "DeleteNotecard",
    "group": "notecard",
    "description": "<p>Deletes a Notecard.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer JWT Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>id of the Notecard which will be deleted</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "AuthToken"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Response 200",
          "content": "{\n  \"_id\": \"59401de1b5746212889f54fa\",\n  \"title\": \"Lorem Ipsum1\",\n  \"task\": \"Dolor Sit2\",\n  \"answer\": \"Ahmet3\",\n  \"owner\": \"593eaa0bcf7f5000011c24c4\",\n  \"lastchange\": \"2017-06-13T17:47:22.826Z\",\n  \"__v\": 0\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/notecard.controller.js",
    "groupTitle": "notecard"
  },
  {
    "type": "get",
    "url": "notecard",
    "title": "GET owned Notecards",
    "name": "GetAllNotecards",
    "group": "notecard",
    "description": "<p>Collects all the notecards of which the authorizated profile has access to and returns them in a json response.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer JWT Token</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "AuthToken"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Response 200",
          "content": "Content-Type: application/json\n{\n  \"593eaebcf8ac692c4c13b2c1\": {\n    \"_id\": \"593eaebcf8ac692c4c13b2c1\",\n    \"title\": \"Lorem Ipsum\",\n    \"task\": \"Dolor Sit\",\n    \"answer\": \"Ahmet\",\n    \"owner\": \"593eaa0bcf7f5000011c24c4\",\n    \"lastchange\": \"2017-06-12T15:58:37.406Z\",\n    \"__v\": 0\n  },\n  \"593eba2d2de774329cfc492d\": {\n  \"_id\": \"593eba2d2de774329cfc492d\",\n  \"title\": \"Lorem Ipsum wuppi\",\n  \"task\": \"Dolor Sit fluppi\",\n  \"answer\": \"Ahmet\",\n  \"owner\": \"593eaa0bcf7f5000011c24c4\",\n  \"lastchange\": \"2017-06-12T15:58:37.406Z\",\n  \"__v\": 0\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/notecard.controller.js",
    "groupTitle": "notecard"
  },
  {
    "type": "get",
    "url": "notecard/:id",
    "title": "GET specific Notecard",
    "name": "GetSpecificNotecards",
    "group": "notecard",
    "description": "<p>Returns the Notecard with the given id.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer JWT Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>id of the notecard</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "AuthToken"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Response 200",
          "content": "Content-Type: application/json\n{\n  \"_id\": \"593eaebcf8ac692c4c13b2c1\",\n  \"title\": \"Lorem Ipsum\",\n  \"task\": \"Dolor Sit\",\n  \"answer\": \"Ahmet\",\n  \"owner\": \"593eaa0bcf7f5000011c24c4\",\n  \"__v\": 0\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/notecard.controller.js",
    "groupTitle": "notecard"
  },
  {
    "type": "post",
    "url": "notecard",
    "title": "POST Notecard",
    "name": "PostNotecard",
    "group": "notecard",
    "description": "<p>Creates a Notecard of the given json body. Owner and the date of creation will be set automatically.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer JWT Token</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "AuthToken"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Request",
          "content": "Content-Type: application/json\n{\n  \"title\": \"Lorem Ipsum\",\n  \"task\": \"Dolor Sit\",\n  \"answer\": \"Ahmet\"\n}",
          "type": "json"
        },
        {
          "title": "Response 200",
          "content": "Content-Type: application/json\n{\n  \"__v\": 0,\n  \"title\": \"Lorem Ipsum\",\n  \"task\": \"Dolor Sit\",\n  \"answer\": \"Ahmet\",\n  \"owner\": \"593eaa0bcf7f5000011c24c4\",\n  \"lastchange\": \"2017-06-13T17:08:53.703Z\",\n  \"_id\": \"59401c25b5746212889f54f9\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/notecard.controller.js",
    "groupTitle": "notecard"
  },
  {
    "type": "post",
    "url": "notecard/set/:id",
    "title": "POST Notecard and Append to Set",
    "name": "PostNotecardAppend",
    "group": "notecard",
    "description": "<p>Creates a Notecard of the given json body. Owner and the date of creation will be set automatically. It will be appended to the Set of the given id.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer JWT Token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>id of the Set on which the newly created Notecard will be appended to.</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "AuthToken"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Request",
          "content": "Content-Type: application/json\n{\n \"bla\": \"bla\"\n}",
          "type": "json"
        },
        {
          "title": "Response 200",
          "content": "Content-Type: application/json\n{\n \"wuppi\": \"fluppi\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/notecard.controller.js",
    "groupTitle": "notecard"
  },
  {
    "type": "put",
    "url": "notecard/:id",
    "title": "PUT Notecard",
    "name": "PutNotecard",
    "group": "notecard",
    "description": "<p>Updates a Notecard with the given json body. Owner and the date of creation will be set automatically.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer JWT Token</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>application/json</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>id of the Notecard which will be updated</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "AuthToken"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Request",
          "content": "Content-Type: application/json\n{\n  \"title\": \"Lorem Ipsum1\",\n  \"task\": \"Dolor Sit2\",\n  \"answer\": \"Ahmet3\",\n  \"owner\": \"593eaa0bcf7f5000011c24c4\"\n}",
          "type": "json"
        },
        {
          "title": "Response 200",
          "content": "Content-Type: application/json\n{\n  \"_id\": \"59401de1b5746212889f54fa\",\n  \"title\": \"Lorem Ipsum1\",\n  \"task\": \"Dolor Sit2\",\n  \"answer\": \"Ahmet3\",\n  \"owner\": \"593eaa0bcf7f5000011c24c4\",\n  \"lastchange\": \"2017-06-13T17:47:22.826Z\",\n  __v\": 0\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/notecard.controller.js",
    "groupTitle": "notecard"
  }
] });

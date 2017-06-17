define({ "api": [
  {
    "type": "get",
    "url": "notecard",
    "title": "GET activities",
    "name": "GetPagewiseActivities",
    "group": "activity",
    "description": "<p>Collects all the activities of the page with an offset of 10 entries.</p>",
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
          "content": "Content-Type: application/json\n[\n  {\n    \"_id\": \"594282b35b08b83670439abd\",\n    \"owner\": \"5942637d16560b00013afd9d\",\n    \"sender\": \"59425e658878750001a42a78\",\n    \"activityType\": \"set_new\",\n    \"__v\": 0\n  },...\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/activity.controller.js",
    "groupTitle": "activity"
  },
  {
    "type": "delete",
    "url": "notecard/:id",
    "title": "DELETE Notecard",
    "name": "DeleteNotecard",
    "group": "notecard",
    "description": "<p>Deletes a Notecard. Emits the notecard_delete event on the websocket for follower.</p>",
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
    "description": "<p>Creates a Notecard of the given json body. Owner and the date of creation will be set automatically. Emits the notecard_new event on the websocket for follower.</p>",
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
    "description": "<p>Creates a Notecard of the given json body. Owner and the date of creation will be set automatically. It will be appended to the Set of the given id. Emits the notecard_new event on the websocket for follower.</p>",
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
    "type": "put",
    "url": "notecard/:id",
    "title": "PUT Notecard",
    "name": "PutNotecard",
    "group": "notecard",
    "description": "<p>Updates a Notecard with the given json body. Owner and the date of lastchange will be set automatically. Emits the notecard_update event on the websocket for follower.</p>",
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
  },
  {
    "type": "get",
    "url": "profile",
    "title": "GET authorized profile",
    "name": "GetAuthorizedProfile",
    "group": "profile",
    "description": "<p>Returns the authorized profile.</p>",
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
          "content": "Content-Type: application/json\n{\n  \"_id\": \"5942637d16560b00013afd9d\",\n  \"email\": \"trololo.guy@meme.com\",\n  \"oauthtoken\": \"auth0|bigfatuglynumber\",\n  \"photourl\": \"https://s.gravatar.com/avatar/bigfatuglynumber.png\",\n  \"visibility\": false,\n  \"cardsPerSession\": 5,\n  \"interval\": 30\n  \"follower\": [],\n  \"sets\": [],\n  \"__v\": 0,\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/profile.controller.js",
    "groupTitle": "profile"
  },
  {
    "type": "post",
    "url": "profile/:id/follow",
    "title": "POST ProfileFollow",
    "name": "PostProfileFollow",
    "group": "profile",
    "description": "<p>Adds the authorized Profile as a follower to target Profile.</p>",
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
            "description": "<p>id of target profile</p>"
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
          "content": "Content-Type: application/json\n{\n  \"_id\": \"59425e658878750001a42a78\",\n  \"email\": \"twiens@fh-bielefeld.de\",\n  \"oauthtoken\": \"auth0|59425e65b2cd9007c3fb5483\",\n  \"photourl\": \"https://s.gravatar.com/avatar/4d3e6507d746b3b849444628a79cf086?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Ftw.png\",\n  \"visibility\": false,\n  \"__v\": 0,\n  \"sets\": [],\n  \"follower\": [\n    \"5942637d16560b00013afd9d\"\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/profile.controller.js",
    "groupTitle": "profile"
  },
  {
    "type": "post",
    "url": "profile/:id/follow",
    "title": "POST ProfileUnfollow",
    "name": "PostProfileUnfollow",
    "group": "profile",
    "description": "<p>Removes the authorized Profile as a follower of target Profile.</p>",
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
            "description": "<p>id of target profile</p>"
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
          "content": "Content-Type: application/json\n{\n  \"_id\": \"59425e658878750001a42a78\",\n  \"email\": \"twiens@fh-bielefeld.de\",\n  \"oauthtoken\": \"auth0|59425e65b2cd9007c3fb5483\",\n  \"photourl\": \"https://s.gravatar.com/avatar/4d3e6507d746b3b849444628a79cf086?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Ftw.png\",\n  \"visibility\": false,\n  \"__v\": 0,\n  \"sets\": [],\n  \"follower\": [\n    \"5942637d16560b00013afd9d\",\n    \"5942637d16560b00013afd9d\"\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/profile.controller.js",
    "groupTitle": "profile"
  },
  {
    "type": "put",
    "url": "profile",
    "title": "PUT authorized profile",
    "name": "PutAuthorizedProfile",
    "group": "profile",
    "description": "<p>Updates the authorized profile.</p>",
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
          "content": "Content-Type: application/json\nContent-Type: application/json\n{\n  \"_id\": \"5942637d16560b00013afd9d\"\n  \"email\": \"trololo.guy@meme.com\",\n  \"oauthtoken\": \"auth0|bigfatuglynumber\",\n  \"photourl\": \"https://s.gravatar.com/avatar/bigfatuglynumber.png\",\n  \"visibility\": false,\n  \"cardsPerSession\": 5,\n  \"interval\": 30\n  \"follower\": [],\n  \"sets\": []\n}",
          "type": "json"
        },
        {
          "title": "Response 200",
          "content": "Content-Type: application/json\n{\n  \"_id\": \"5942637d16560b00013afd9d\"\n  \"email\": \"trololo.guy@meme.com\",\n  \"oauthtoken\": \"auth0|bigfatuglynumber\",\n  \"photourl\": \"https://s.gravatar.com/avatar/bigfatuglynumber.png\",\n  \"visibility\": false,\n  \"cardsPerSession\": 5,\n  \"interval\": 30\n  \"follower\": [],\n  \"sets\": [],\n  \"__v\": 0,\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/profile.controller.js",
    "groupTitle": "profile"
  },
  {
    "type": "delete",
    "url": "set/:id",
    "title": "DELETE Set",
    "name": "DeleteSet",
    "group": "set",
    "description": "<p>Deletes a Set. Emits the set_delete event on the websocket for follower.</p>",
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
            "description": "<p>id of the Set which will be deleted</p>"
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
          "content": "{\n  \"_id\": \"59403626858fab21f0028f6c\",\n  \"owner\": \"593eaa0bcf7f5000011c24c4\",\n  \"lastchange\": \"2017-06-13T18:59:50.780Z\",\n  \"visibility\": true,\n  \"photourl\": \"\",\n  \"title\": \"Never gonna give you up\",\n  \"description\": \"Never gonna let you down\",\n  \"__v\": 0,\n  \"valuations\": [],\n  \"tags\": [ \"wuppi\", \"fluppi\" ],\n  \"notecard\": [ \"593eaebcf8ac692c4c13b2c1\" ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/set.controller.js",
    "groupTitle": "set"
  },
  {
    "type": "get",
    "url": "set",
    "title": "GET owned Sets",
    "name": "GetAllSets",
    "group": "set",
    "description": "<p>Collects all the sets of which the authorizated profile has access to and returns them in a json response.</p>",
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
          "content": "Content-Type: application/json\n{\n  \"59402f281704792b4c4a151f\": {\n    \"__v\": 0,\n    \"owner\": \"593eaa0bcf7f5000011c24c4\",\n    \"lastchange\": \"2017-06-13T18:30:00.076Z\",\n    \"visibility\": true,\n    \"photourl\": \"\",\n    \"title\": \"Never gonna give you up\",\n    \"description\": \"Never gonna let you down\",\n    \"valuations\": [],\n    \"tags\": [ \"wuppi\", \"fluppi\" ],\n    \"notecard\": [ \"593eaebcf8ac692c4c13b2c1\" ]\n  },...\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/set.controller.js",
    "groupTitle": "set"
  },
  {
    "type": "get",
    "url": "set/:id",
    "title": "GET specific Set",
    "name": "GetSpecificSet",
    "group": "set",
    "description": "<p>Returns the Set with the given id.</p>",
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
            "description": "<p>id of the set</p>"
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
          "content": "Content-Type: application/json\n{\n  \"__v\": 0,\n  \"owner\": \"593eaa0bcf7f5000011c24c4\",\n  \"lastchange\": \"2017-06-13T18:30:00.076Z\",\n  \"visibility\": true,\n  \"photourl\": \"\",\n  \"title\": \"Never gonna give you up\",\n  \"description\": \"Never gonna let you down\",\n  \"_id\": \"59402f281704792b4c4a151f\",\n  \"valuations\": [],\n  \"tags\": [ \"wuppi\", \"fluppi\" ],\n  \"notecard\": [ \"593eaebcf8ac692c4c13b2c1\" ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/set.controller.js",
    "groupTitle": "set"
  },
  {
    "type": "post",
    "url": "set",
    "title": "POST Set",
    "name": "PostSet",
    "group": "set",
    "description": "<p>Creates a Set of the given json body. Owner and the date of creation will be set automatically. Emits the set_new event on the websocket for follower</p>",
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
          "content": "Content-Type: application/json\n{\n  \"notecard\": [ \"593eaebcf8ac692c4c13b2c1\" ],\n  \"tags\": [ \"wuppi\", \"fluppi\" ],\n  \"valuations\": [],\n  \"visibility\": \"true\",\n  \"photourl\": \"\",\n  \"title\": \"Never gonna give you up\",\n  \"description\": \"Never gonna let you down\"\n}",
          "type": "json"
        },
        {
          "title": "Response 200",
          "content": "Content-Type: application/json\n{\n  \"__v\": 0,\n  \"owner\": \"593eaa0bcf7f5000011c24c4\",\n  \"lastchange\": \"2017-06-13T18:30:00.076Z\",\n  \"visibility\": true,\n  \"photourl\": \"\",\n  \"title\": \"Never gonna give you up\",\n  \"description\": \"Never gonna let you down\",\n  \"_id\": \"59402f281704792b4c4a151f\",\n  \"valuations\": [],\n  \"tags\": [ \"wuppi\", \"fluppi\" ],\n  \"notecard\": [ \"593eaebcf8ac692c4c13b2c1\" ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/set.controller.js",
    "groupTitle": "set"
  },
  {
    "type": "post",
    "url": "set/:id/addCards",
    "title": "POST addCards",
    "name": "PostSetAddCard",
    "group": "set",
    "description": "<p>Adds given cards to the set. Emits the set_update event on the websocket for follower.</p>",
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
            "description": "<p>id of the Set on which the cards will be added</p>"
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
          "content": "{\n  \"notecards\": [ \"59425ee05ee41e268c9dec3c\",... ]\n}",
          "type": "json"
        },
        {
          "title": "Response 200",
          "content": "{\n  \"_id\": \"59425f345ee41e268c9dec3d\",\n  \"owner\": \"59425e658878750001a42a78\",\n  \"lastchange\": \"2017-06-15T10:19:32.904Z\",\n  \"visibility\": true,\n  \"photourl\": \"\",\n  \"title\": \"Never gonna give you up\",\n  \"description\": \"Never gonna let you down\",\n  \"__v\": 0,\n  \"valuations\": [],\n  \"tags\": [\n    \"wuppi\",\n    \"fluppi\"\n  ],\n  \"notecard\": [\n    \"59425eda5ee41e268c9dec3a\",\n    \"59425ee05ee41e268c9dec3c\"\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/set.controller.js",
    "groupTitle": "set"
  },
  {
    "type": "post",
    "url": "set/:id/addTags",
    "title": "POST addTags",
    "name": "PostSetAddTag",
    "group": "set",
    "description": "<p>Adds given tagss to the set. Emits the set_update event on the websocket for follower.</p>",
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
            "description": "<p>id of the Set on which the cards will be added</p>"
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
          "content": "{\n  \"tags\": [ \"duppi\",... ]\n}",
          "type": "json"
        },
        {
          "title": "Response 200",
          "content": "{\n  \"_id\": \"59425f345ee41e268c9dec3d\",\n  \"owner\": \"59425e658878750001a42a78\",\n  \"lastchange\": \"2017-06-15T10:19:32.904Z\",\n  \"visibility\": true,\n  \"photourl\": \"\",\n  \"title\": \"Never gonna give you up\",\n  \"description\": \"Never gonna let you down\",\n  \"__v\": 0,\n  \"valuations\": [],\n  \"tags\": [\n    \"wuppi\",\n    \"fluppi\",\n    \"duppi\"\n  ],\n  \"notecard\": [\n    \"59425eda5ee41e268c9dec3a\",\n    \"59425ee05ee41e268c9dec3c\"\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/set.controller.js",
    "groupTitle": "set"
  },
  {
    "type": "post",
    "url": "set/:id/removeCards",
    "title": "POST removeCards",
    "name": "PostSetRemoveCard",
    "group": "set",
    "description": "<p>Removes given cards to the set. Emits the set_update event on the websocket for follower.</p>",
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
            "description": "<p>id of the Set on which the cards will be removed</p>"
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
          "content": "{\n  \"notecards\": [ \"593eaebcf8ac692c4c13b2c1\",... ]\n}",
          "type": "json"
        },
        {
          "title": "Response 200",
          "content": "{\n  \"_id\": \"59425f345ee41e268c9dec3d\",\n  \"owner\": \"59425e658878750001a42a78\",\n  \"lastchange\": \"2017-06-15T10:19:32.904Z\",\n  \"visibility\": true,\n  \"photourl\": \"\",\n  \"title\": \"Never gonna give you up\",\n  \"description\": \"Never gonna let you down\",\n  \"__v\": 0,\n  \"valuations\": [],\n  \"tags\": [\n    \"wuppi\",\n    \"fluppi\"\n  ],\n  \"notecard\": [\n    \"59425eda5ee41e268c9dec3a\",\n    \"59425ee05ee41e268c9dec3c\"\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/set.controller.js",
    "groupTitle": "set"
  },
  {
    "type": "post",
    "url": "set/:id/removeTags",
    "title": "POST removeTags",
    "name": "PostSetRemoveTag",
    "group": "set",
    "description": "<p>Removes given tags of the set. Emits the set_update event on the websocket for follower.</p>",
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
            "description": "<p>id of the Set on which the tags will be removed</p>"
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
          "content": "{\n  \"tags\": [ \"duppi\",... ]\n}",
          "type": "json"
        },
        {
          "title": "Response 200",
          "content": "{\n  \"_id\": \"59425f345ee41e268c9dec3d\",\n  \"owner\": \"59425e658878750001a42a78\",\n  \"lastchange\": \"2017-06-15T10:19:32.904Z\",\n  \"visibility\": true,\n  \"photourl\": \"\",\n  \"title\": \"Never gonna give you up\",\n  \"description\": \"Never gonna let you down\",\n  \"__v\": 0,\n  \"valuations\": [],\n  \"tags\": [\n    \"wuppi\",\n    \"fluppi\",\n    \"duppi\"\n  ],\n  \"notecard\": [\n    \"59425eda5ee41e268c9dec3a\",\n    \"59425ee05ee41e268c9dec3c\"\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/set.controller.js",
    "groupTitle": "set"
  },
  {
    "type": "put",
    "url": "set/:id",
    "title": "PUT Set",
    "name": "PutSet",
    "group": "set",
    "description": "<p>Updates a Set with the given json body. Owner and the date of lastchange will be set automatically. Emits the set_update event on the websocket for follower.</p>",
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
            "description": "<p>id of the Set which will be updated</p>"
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
          "content": "Content-Type: application/json\n{\n  \"notecard\": [ \"593eaebcf8ac692c4c13b2c1\", \"593eba2d2de774329cfc492d\" ],\n  \"tags\": [ \"wuppi\", \"fluppi\", \"duppi\" ],\n  \"valuations\": [],\n  \"visibility\": \"false\",\n  \"photourl\": \"\",\n  \"title\": \"Never gonna run around\",\n  \"description\": \"and desert you\",\n}",
          "type": "json"
        },
        {
          "title": "Response 200",
          "content": "Content-Type: application/json\n{\n\"_id\": \"59402f281704792b4c4a151f\",\n\"owner\": \"593eaa0bcf7f5000011c24c4\",\n\"lastchange\": \"2017-06-13T18:53:38.560Z\",\n\"visibility\": false,\n\"photourl\": \"\",\n\"title\": \"Never gonna run around\",\n\"description\": \"and desert you\",\n\"__v\": 0,\n\"valuations\": [],\n\"tags\": [ \"wuppi\", \"fluppi\", \"duppi\" ],\n\"notecard\": [ \"593eaebcf8ac692c4c13b2c1\", \"593eba2d2de774329cfc492d\" ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/set.controller.js",
    "groupTitle": "set"
  }
] });

---
id: authentication
title: Authentication
---
Some endpoints are protected and require an API key,or token to access them

### registering users

```json title="POST /auth/register"
[
    {
        "method":"email",
        "email":"nico@nico.com",
        "password":"123456"

    }
]
```
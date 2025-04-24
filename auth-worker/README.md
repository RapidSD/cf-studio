# OAuth2 Authorization server

Meant to be hosted on auth. subdomain of the main application.
Takes user email or google auth and issues a JWT token that can be used to access the main application.


### Set up

create .dev.vars / .env.local file


### Working with D1

Create migration
```
npx wrangler d1 migrations create cf-studio-auth init
```

Run migration
```
npx wrangler d1 migrations apply cf-studio-auth
```
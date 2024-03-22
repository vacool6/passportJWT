
# Passport JWT

JWT-Based Authentication:

How it works: JSON Web Tokens (JWT) are encoded tokens containing user information and digital signatures to verify their authenticity. 
When a user logs in, the server creates a JWT and sends it to the client.

Usage: The client stores the JWT (usually in local storage or a cookie) and includes it in the header of subsequent requests.

Pros: Stateless (no need for server-side storage), easily scalable, supports cross-origin resource sharing (CORS), suitable for microservices architectures.

Cons: Tokens cannot be invalidated before expiration without additional complexity (blacklisting, short-lived tokens), potential security risks if not implemented correctly (e.g., token leakage).

## Running the application

### Frontend setup
 Follow JWT-frontend repo.
 
  
  ### Backend setup
 1 . Logic is available in backend folder in PassportLocal-React forder.

 2 . `$ npm i` to install all the depencencies.

 3 . Setup your .env file (optional).

 ### Flow
 Frontend on X-port interacts with server on Y-port. You can register, login & log user out from React client.

### Note:
Need to have node installed


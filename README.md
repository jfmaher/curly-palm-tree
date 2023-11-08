## Apata

I did this exercise using [Nest](https://nestjs.com/) working from a new project created using it's cli. 

#### Data Storage

- The card details are stored in a difference table to the accounts. This is to make accidental returning of this information less likely.
- Symmetric encryption was used so that the card holder information is persisted. This may look redundant because there is also an un salted hash for looking up the details for the /charge and /credit endpoints.

#### Endpoints

- The endpoints are together in `src/app.controller.ts`
- They do not have security on them. I spent too much time on learning about encryption.
  - This could be done using user/password sessions and relating them to particular accounts.

#### Validation

- Most of the endpoint validation is done using validation pipes that come with NestJS
- There is a custom one for credit card numbers which does a simple regex for a 16 digit string
- Validation of the NewAccountDto is done using the ValidationPipe from Nest which makes use of the [class-validator](https://www.npmjs.com/package/class-validator) library

#### Error Handling

- The errors handled manually have descriptive strings that are stored as constants in `src/errors.ts`
- Error codes have been added to them using the http exceptions and default global exception handler which are both of nest.

#### Card Types

- The card types are part of the CardDetails class

#### Payment Gateway Integration

- There is a payment gateway service which acts as a stub for real integration.
- It returns a empty promise which in testing is mocked to throw errors to simulate a failure.

#### Testing

- There are two ways to run tests
  - `npm test` runs the unit and integration tests under the `src/` folder which focus on functionality like the transactions, the encryption and that the searching of the database with the hash works.
  - `npm test:e2e` runs the end to end tests that are in `test/app.e2e-spec.ts` which focus on integrations with Nest like validation.
- There are some gaps in the testing
  - ORM functions that have facades are not tested.
  - Not all the endpoints and their validations are tested.
- There is no dependencies outside of this project so there is nothing else required to run end to end tests.

## Details for running and testing.

#### Installation

The app should be relatively easy to install and run. SQLite was chosen for this purpose and it is another reason for trying to avoid user sign ins or keys.

```bash
$ npm install
```

#### Usage

The API is as specified with the addition of DTOs used in the POST and PUT requests.

- Creating and updating accounts requires a JSON body of `NewAccountDto`
- Charging and crediting an account uses a JSON body that has the property `"amount"` whose value is a non-negative integer.

> There are samples in `rest-api_1.http` which are also runnable in the JetBrains http client. At least that is where I made and ran them.

There is a sample key for the aes256 encryption in the root directory that is currently loaded in the encryption module.



## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


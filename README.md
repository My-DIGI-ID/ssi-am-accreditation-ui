# SsiAmAccreditationUi

## **Table of contents**

- [Set Up](#set-up)
  - [Required Dependencies](#required-dependencies)
  - [Required Environment Variables](#required-environment-variables)
  - [Running the application locally](#running-the-application-locally)
  - [Building the application](#building-the-application)
  - [Running the application locally](#running-the-application-locally)
- [Testing](#testing)
  - [Running the Unit Tests](#running-the-unit-tests)
- [Code Quality](#code-quality)
  - [Code formatting](#code-formatting)
- [Documentation](#documentation)

## **Set Up**

### **Required Dependencies**

- NodeJS 14.15

In order to run the application `npm install` needs to be called to install all other dependencies
To fully test the functionality, the other components need to be started as well.

### **Required Environment Variables**

| Variable                          | Description                                      |
| --------------------------------- | ------------------------------------------------ |
| ACCR_UI_CONTAINER_NAME            | Accreditation UI docker container name parameter |
| ACCR_UI_HOST                      | The host the UI will use                         |
| ACCR_UI_PORT                      | The port the UI will use                         |
| ACCREDITATION_CONTROLLER_BASE_URL | The base url of the Accreditation controller     |
| KEYCLOAK_URL                      | The base url to the keycloak instance            |
| KEYCLOAK_REALM                    | The realm configured in keycloak                 |
| KEYCLOAK_CLIENT_ID                | The client id configured in keycloak             |

### **Building the application**

To compile and package the application use the following command:

```
npm run build:prod
```

### **Running the application locally**

If you want to run the application locally:

```sh
npm run start
```

## **Testing**

### **Running the Unit Tests**

The unit test can be run through your preferred IDE.

Suggested: VisualStudio Code

Alternatively the unit test can also be run using the following command:

```sh
npm run test
```

### **Coverage**

The coverage report can be generated via this command:

```sh
npm run test:headless
```

## **Code Quality**

### **Code formatting**

Identical code formatting can be ensured via prettier.

```sh
npm run format
```

Alternatively you can use a pre-commit hook and use the prepared command:

```sh
npm run pre-commit
```

### Documentation

To generate a documentation as html run:
```sh
npm run compodoc
```

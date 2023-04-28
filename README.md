# AppWorks Angular startup kit - in the foot steps of schematics 
##Add AppWorks with the following command
Provide the following inputs
1. AppWorks gateway url
2. Organization dn - the dn of the organization
3. Date format - select from the options provided 
4. What authentication do you want to use
AppWorks - this will authenticate user against AppWorks
OTDS - this will authenticate against OTDS, using the OTDS rest API, not the SSO. You will have to provide the OTDS rest url also
Custom - use this if you want to authenticate against any other identity management or want to use OTDS SSO. you will have to customise the the authentication service for this
5. UI framework - select one from the options. This will install and configure the selected UI framework in the project
6. Config path - all the above provided inputs will be written to config.json. This file will be created in the assets folder of the project. If you are planning to move this file to some other location, you can provide it here. Later also you can move it and modify the app.module file to update the location.

Once the command completes without any errors, the project is setup.



This will read the given WSDL url, generate ts interfaces for the messages and elements in the WSDL. Then generate angular services to call the web services, and a component for the service in angular.

The idea is only code generation, to reduce the time required to write the code required to work with AppWorks webservices. 

Anytime this is run, it will always create new code. The existing code cannot be modified by this tool. As stated earlier the intended usage is to reduce the time required to get started with AppWorks webservices. 


## WSDL parser
The wsdl parser will read the given AppWorks wsdl url, using resolve externals parameter, and create a denormalized flat structures for all the complex types, simple types, elements and messages. This is mainly internal and used by the interface and service generators.

## Interface generator
1. This will generate interfaces for the messages and elements used by the messages. This generates multiple interfaces based on the elements in the wsdl, and these interfaces are used in other interfaces where they are referenced. This gives the benefits of directly creating and using inner types rather than accessing everything from the message. 
2. Every time this is run, it will generate a new Interface file, merging with existing interfaces for reusing and reduce clutter is developer responsibility. 

## Service generator
1. This should generate a service file for the given wsdl. 
2. This will import interfaces generated during the particular execution, changing it to use already generated in previous executions is developer's responsibility. 
3. This should generate service to call the webservice using angular httpclient and convert to and from xml & json, respecting the wsdl contract. 
4. The service endpoint must be read from a config file, rather than using from the wsdl. 
5. The authentication will be both otds & samlart cookie based, if the cookie is not present or if received authentication error, we must raise an error. I need to investigate if this can be some common exception like the java exceptions. 
6. Abstraction will not be provided by hiding httpclient and xmljs, developer is free to change the generated code. 
7. The code generator will always create new code and cannot modify existing code. 

## Component generator 
1. Create component file using reactive form, template file using clarity design 
2. Identify update service or use appworks convention to determine update service. 
3. For updating data, the formgroup raw value will be sent as input. 

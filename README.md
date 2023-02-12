# AppWorks Angular startup kit - in the foot steps of schematics 
This will read the given WSDL url, generate ts interfaces for the messages and elements in the WSDL. Then generate angular services to call the web services, and a component for the service in angular.

The idea is only code generation, to reduce the time required to write the code required to work with AppWorks webservices, it's not a replacement for angular cli or integrated with it. The developer must register and integrate the generated code in their angular project. 

Anytime this is run, it will always create new code. The existing code cannot be modified by this tool. As stated earlier the intended usage is to reduce the time required to get started with AppWorks webservices. 


## WSDL parser
The wsdl parser will read the given AppWorks wsdl url, using resolve externals parameter, and create a denormalized flat structures for all the complex types, simple types, elements and messages. This is mainly internal and used by the interface and service generators.

## Interface generator
1. This will generate interfaces for the messages and elements used by the messages. This generates multiple interfaces based on the elements in the wsdl, and these interfaces are used in other interfaces where they are referenced. This gives the benefits of directly creating and using inner types rather than accessing everything from the message. 
2. Every time this is run, it will generate a new Interface file, merging with existing interfaces for reusing and reduce clutter is developer responsibility. 

## Service generator
1. This should generate a service file for the given wsdl. 
2. This will import interfaces generated during the particular execution, changing it to use already generated in previous executions is developer's responsibility. 
3. This should generate service to call the webservice using angular httpclient and convert to and from xml & json. 
4. The service endpoint must be read from a config file, rather than using from the wsdl. 
5. This will only generate the service file, registering and integrating in the respective angular module is the developer's responsibility 
6. The authentication will be samlart cookie based, if the cookie is not present or if received authentication error, we must raise an error. I need to investigate if this can be some common exception like the java exceptions. 
7. Investigate the possibility of using otds
8. Abstraction will not be provided by hiding httpclient and xmljs, developer is free to change the generated code. 
9. The code generator will always create new code and cannot modify existing code. 

## Component generator 
1. Create component file using reactive form, template file using clarity design 
2. There must be an option to skip component generation, in order to use utility webservices not related to ui
3. There must be an option to select the webservice for generating the ui component and to say if it's a readonly. If it's not readonly, we need to know the webservice for updating the data.
4. For updating data, the formgroup raw value will be sent as input. 

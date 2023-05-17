# AppWorks Angular startup kit - in the foot steps of schematics 
## Add AppWorks with the following command
`ng add @msjumbu/app-works`

Provide the following inputs
1. Please enter your AppWorks Gateway URL (`http://{IP}:{Port}/home/{organization}/com.eibus.web.soap.Gateway.wcp`)
2. Please enter your organization DN (Ex: `o=system,cn=cordys,cn=defaultInst,o=opentext.com`)
3. Which UI Framework would you like to use? (Use arrow keys)
    - Angular Material 
    - Clarity Design 
    - PrimeNG
4. Which Date Format would you like to use? (Use arrow keys) *This can be changed later in config.json*
    - dd/MM/yyyy 
    - MM/dd/yyyy 
    - yyyy/MM/dd 
    - short - 'M/d/yy, h:mm a' 
    - medium - 'MMM d, y, h:mm:ss a' 
    - long - 'MMMM d, y, h:mm:ss a z'
5. Please enter the relative path to config.json *The relative path to the config.json in the web server. After the aw schema is successfully initialized, you need to copy the assets/config.json from this project to config path in the web server. If no path is provided, default assets/config.json will be used. Later also you can move it and modify the app.module file to update the location.*

**If you have selected Angular Material, at this point there will be options to select for the Angular Material framework**

6. Which authentication would you like to use? (Use arrow keys)
    - OTDS *this will authenticate against OTDS, using the OTDS rest API, not the SSO*
    - AppWorks *AppWork authentication API will be used*
    - Custom *use this if you want to authenticate against any other identity management or want to use OTDS SSO. you will have to customise the the authentication service for this*

This command will initialise the angular project to be ready for working with AppWorks services and install the selected UI framework.

Once the command completes without any errors, the project is setup.

The following files are generated,

The following files are modified,

If you need to change the config.json file path at any later point of time, you have to change it here.

While you are able to change almost all of the chosen configuration anytime, it will be difficult to change the UI framework if you have already created components with the selected UI framework. Changing the UI framework is not impossible, but you may have to do lot of changes to the components or recreate them again. 

One of the guiding principles of this utility is NOT to abstract anything from the developer or to provide a reusable component. The developer will be able to change any of the generated code without having to depend on the utility for any application functionality. 

Now we are ready to add components to the project.

## Add component with the following command
Provide the following inputs
1. WSDL url - the url of the WSDL containing the service to be used in the component. Only one service needs to be present in the WSDL. If there are more than one service, like you provided the methodset WSDL, you will get error
2. Name - name of the component
3. Module - if you want to create the component in a module

Once you provide the inputs the following things will be done,
1. WSDL will be downloaded
2. A types file will be created with all the types in the WSDL
3. A service file will be created, which will be responsible for calling the service from AppWorks
4. A UI component will be created with the fields available in the WSDL. If the service is returning an array of objects, then a grid and details type of UI. If the service is returning a single object, then a form will be created with the service fields. 
5. The generated UI will be ready for both reading the data from the service, display it in the grid/form and update data as well.
6. If your service is like composite service, the above component may not be created properly. it's your responsibility to modify the component to work.

Array guarantee - if the service is returning an array of objects (as per WSDL) then the service will always return an array, even if the service returns a single object. No more checking if the service returned array or single object.

Reactive forms - the forms generated will always be reactive forms.

Required fields - if the WSDL mentions any field as required (minoccurs = 1), then a required validator is added to the field.

The following files are generated,

The following files are modified,




This will read the given WSDL url, generate ts interfaces for the messages and elements in the WSDL. Then generate angular services to call the web services, and a componlent for the service in angular.

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

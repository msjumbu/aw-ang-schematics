# AppWorks Angular schematics 
***While creating the new angular project, it will help if you include routing and select stylesheet as css***
## Add AppWorks with the following command
`ng add @otaw/app-works`

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
```
- src/app/config/config.service.ts
- src/app/services/utils.ts
- src/assets/logo.png
- src/assets/config.json
- src/app/services/auth/auth-guard.service.ts
- src/app/services/auth/authentication.service.ts
- src/app/modules/material.module.ts -> just a helper module to add all required material modules, this is generated if material was selected
```
The following files are modified,
```
- src/app/app.module.ts
```
If you need to change the config.json file path at any later point of time, you have to change it in app.module.ts.

```typescript
function initializeAppFactory(httpClient: HttpClient, configService: ConfigService): () => Observable<any> {
    // Replace this path, if the config file location is changed
    return () => httpClient.get<Config>('***  assets/config.json  ***')
    .pipe(
        tap(config => { 
        configService.config = config;
        })
    );
}
```
While you are able to change almost all of the chosen configuration anytime, it will be difficult to change the UI framework if you have already created components with the selected UI framework. Changing the UI framework is not impossible, but you may have to do lot of changes to the components or recreate them again. 

### config.json
```json
{
  "GATEWAY_URL": "http://localhost:81/home/test/com.eibus.web.soap.Gateway.wcp",
  "ORG_DN": "o=test,cn=cordys,cn=defaultInst,o=lab.opentext.com",
  "UI_FRAMEWORK": "material",
  "DATE_FORMAT": "dd/MM/yyyy",
  "AUTH_TYPE": "AW"
}
```

One of the guiding principles of this utility is NOT to abstract anything from the developer or to provide a reusable component. The developer will be able to change any of the generated code without having to depend on the utility for any application functionality. 

Now we are ready to add components to the project.

## Add login page
If you are using OTDS SSO, this is not required.

`ng g @otaw/app-works:login`

This creates a simple login page. Add the generated component to the routing with path 'login'. The generated auth gaurd service routes to the login, if you are changing this path you need to do change it in here also `src/app/services/auth/auth-guard.service.ts`.

```typescript
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (!this.auth.isAuthenticated()) {
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }
```

## Add component
`ng g @otaw/app-works:component --module=<module_name>`

Module is optional, if you dont have module it can be left out.

Provide the following inputs
<pre>
- Please enter WSDL URL <b>http://10.96.75.123:81/home/SCM/com.eibus.web.tools.wsdl.WSDLGateway.wcp?service=http%3A%2F%2Fschemas.cordys.com%2Fsalesorderdatabasemetadata%2FGetEntityMasterDetails&organization=o%3DSCM%2Ccn%3Dcordys%2Ccn%3DdefaultInst%2Co%3Dlab.opentext.com&methodset=cn%3DMethodSet_SO_Transaction.MethodSet_SO_Transaction_WSI%2Ccn%3Dmethod%20sets%2Co%3DSCM%2Ccn%3Dcordys%2Ccn%3DdefaultInst%2Co%3Dlab.opentext.com</b>
- Please enter component name <b>entities list</b>
- Do you want to skip service generation? Useful when you have already created service and the service signature has changed. <b>No</b>
</pre>

Once you provide the inputs the following things will be done,
1. WSDL will be downloaded
2. A types file will be created with all the types in the WSDL
3. A service file will be created, which will be responsible for calling the service from AppWorks
4. A UI component will be created with the fields available in the WSDL. It will be either table or form, based on the response of the service
5. The generated UI will be ready for both reading the data from the service, display it in the grid/form and update data as well.
6. If your service is like composite service, the above component may not be created properly. it's your responsibility to modify the component to work.

Array guarantee - if the service is returning an array of objects (as per WSDL) then the service will always return an array, even if the service returns a single object. No more checking if the service returned array or single object.

Reactive forms - the forms generated will always be reactive forms.

Required fields - if the WSDL mentions any field as required (minoccurs = 1), then a required validator is added to the field.

The following files are generated,
<pre>
- src/app/entities-list/entities-list.component.html
- src/app/entities-list/entities-list.component.spec.ts
- src/app/entities-list/entities-list.component.ts
- src/app/entities-list/entities-list.component.css
- src/app/entities-list/services/get-entity-master-details.types.ts
- src/app/entities-list/services/get-entity-master-details.service.ts
</pre>

## Add service
`ng g @otaw/app-works:service`

Provide the following inputs
<pre>
- Please enter WSDL URL <b>http://10.96.75.123:81/home/SCM/com.eibus.web.tools.wsdl.WSDLGateway.wcp?service=http%3A%2F%2Fschemas.cordys.com%2Fsalesorderdatabasemetadata%2FGetEntityMasterDetails&organization=o%3DSCM%2Ccn%3Dcordys%2Ccn%3DdefaultInst%2Co%3Dlab.opentext.com&methodset=cn%3DMethodSet_SO_Transaction.MethodSet_SO_Transaction_WSI%2Ccn%3Dmethod%20sets%2Co%3DSCM%2Ccn%3Dcordys%2Ccn%3DdefaultInst%2Co%3Dlab.opentext.com</b>
- Do you want to skip service generation? Useful when you have already created service and the service signature has changed. <b>No</b>
</pre>

This will generate the types & service files for the given wsdl, in services sub folder under current path.
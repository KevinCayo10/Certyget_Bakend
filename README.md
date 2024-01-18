# Backend  Sistema de Gestión de Certificados 
El proyecto es la implementación de un Sistema de Gestión de Certificados, tanto para plataformas web como móviles. Diseñado para simplificar y optimizar el proceso de emisión, búsqueda y validación de certificados, esta aplicación permite a los administradores crear y gestionar certificados de manera eficiente. Los usuarios móviles pueden realizar búsquedas por apellidos o número de cédula, facilitando la verificación de la autenticidad de los certificados mediante el código asociado. El backend, basado en Node.js y Express, la interacción con bases de datos MySQL y proporcionando servicios seguros a través de autenticación.
## Guía de Implementación del Proyecto 🚀

### Requisitos Previos 
##### Configuración de Variables de Entorno en Google Cloud App Engine: 
Se realiza una configuracion de las variables de entorno necesarias directamente en la consola de Google Cloud

##### Configuración de la Base de Datos en Google Cloud:
Nos aseguramos de que la instancia del backend este referenciada a la base de datos que se encuentra en la nube
##### Gestión de Dependencias en Producción:
Verificamos que existan las dependencias necesarias, estas se encuentran en el archivo package.json
# Instrucciones de configuracion del backend en entorno local 
1. Clonar el repositorio:
```
https://github.com/KevinCayo10/Certyget_Bakend.git
```
2. Navega en el directorio :
```
cd certyget_backend
```
3. Instala las dependencias:
```
npm install
```
4. Crea un archivo .env en el directorio del backend y donde se configura las variables de entorno necesarias, como las credenciales de la base de datos
5. Iniciamos el servidor de manera local :
```
npm run start
```
## Despliegue del backend 📦
##### Configuraciones:
###### Verifica que las configuraciones en app.yaml
###### Despliegue 
En el directorio donde se encuentra el archivo de configuracion `app.yaml`
se realiza el deploy:
runtime: nodejs18
service: default
readiness_check:
  timeout_sec: 120
env_variables:
  MYSQL_HOST: "35.227.68.74"
  MYSQL_PORT: "3306"
  MYSQL_USER: "root"
  MYSQL_PASSWORD: "Admin123"
  MYSQL_DATABASE: "certyget"
  JWT_KEY: "qwe123"

  CREDENTIAL GCLOUD
  PROJECT_ID: "axiomatic-sonar-405920"
  BUCKET_NAME: "gs://storage_certyget"
  KEY_FILENAME: "service-account.json"
  ##### Se ejecuta el siguiente comando:
```  
gcloud app deploy 
```
## Construido con 🛠️
- [Node.js](https://nodejs.org/):Node.js es un entorno de ejecución para JavaScript en el lado del servidor. Permite construir aplicaciones escalables y eficientes.
- [MySQL:](https://www.mysql.com/) :MySQL es un sistema de gestión de bases de datos relacional ampliamente utilizado.
- [Postman](https://www.postman.com/):Postman es una herramienta colaborativa que facilita la creación, prueba y documentación de APIs
- [Google Cloud Platform (GCP)](https://cloud.google.com/?utm_source=google&utm_medium=cpc&utm_campaign=latam-LATAM-all-es-dr-BKWS-all-all-trial-p-dr-1707800-LUAC0014410&utm_content=text-ad-none-any-DEV_c-CRE_512379899447-ADGP_Hybrid+%7C+BKWS+-+PHR+%7C+Txt+~+GCP_General-KWID_43700062788251512-kwd-472986476149&utm_term=KW_gcloud-ST_GCloud&gad_source=1&gclid=Cj0KCQiAnfmsBhDfARIsAM7MKi0L_bNTFiyxXpRaelNWjg-vlI9CmwLICibf_Tm2J1yZQ4V7dvoCVS8aAiq2EALw_wcB&gclsrc=aw.ds):Google Cloud Platform es una suite de servicios en la nube ofrecida por Google, que incluye servicios como App Engine.
# Autores ✒️

El proyecto fue posible gracias a la contribución de las siguientes personas:

- **Kevin Cayo** - Full Stack Backend - [KevinCayo10](https://github.com/KevinCayo10)   ([kcayo6155@uta.edu.ec](mailto:kcayo6155@uta.edu.ec))
- **Erik Granda** - Full Stack Frontend - [ErikGranda3756](https://github.com/ErikGranda3756) ([egranda3756@uta.edu.ec](mailto:egranda3756@uta.edu.ec))
- **Rafael Brito** - Gestor del Proyecto - [RafaBrito008](https://github.com/RafaBrito008) (rbrito9162@uta.edu.ec)
- **Johan Changoluisa** - Gestor de Documentación - [johanariel](https://github.com/johanariel) ([jchangoluisa6803@uta.edu.ec](mailto:jchangoluisa6803@uta.edu.ec))
------


Agradecemos a todos los [contribuyentes](#contribuyentes) que han participado en este proyecto. 🌟

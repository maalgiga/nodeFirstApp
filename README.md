#Mi Primer Aplicaciones con Node.JS, MongoDB y Express

##Instalación
1. Clonar el repositorio en un ambiente con Node.js y MongoDB instalado.
2. Instalar Dependencias
  - npm install
3. Ejecutar Scripts para ingresar datos de prueba
  - node ./setupfiles/loadsecciones.js
  - node ./setupfiles/loadusers.js
4. Correr el Server
  - node ./bin/www
5. En un browser acceder a la url en puerto 3000

##Notas
* Se recomienda usar forever (*npm install -g forever*) con monitor de directorios para que se inicie el server en cada modificación no estatica de los elementos.
  - forever start -w ./bin/www
* Para facilitar la ejecucion en tiempo de depuración se debe crear un script que setee las siguientes variables en el ambiente:
  * JQM_USECDN=1
  * PORT=80
  * DEBUG=newNodeProject

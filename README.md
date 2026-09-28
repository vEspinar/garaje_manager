# Garage Manager &#128663; &#128736;

[ 🇪🇸 Español](#español)|[ ca Català](#catala)|[ 🇬🇧|🇺🇸 English](#english)

## **English**
## 📝Summary:
This app allows you to manage a repairshop fleet using asynchronous communication (AJAX) with node.js server and SQLite.

## Run Instructions
1. Install dependencies: `npm install`
2. Run server: `npm start`
3. Open `index.html` in browser

## Implemented features
- Added a validation system using **Regular Expressions (Regex)** to block adding a vehicle if text input is not a valid plate (format: 0000XXX). It uses Spanish plates which have no vowels.
- Added a system to detect if the app is connected to endpoint.
- Added 6 buttons (2 for each vehicle data) to sort results ascending or descending.
- Added a search function to locate vehicles which, in case the input is a plate with the format mentioned in point 1, searches by plate, else searches by id.
- Lastly, added a button to show vehicles list and "reset" it to default order (by ascending Id).

## **Català**
## 📝Resum:
Aquesta aplicació permet gestionar la flota d'un taller mecànic utilitzant comunicació asíncrona (AJAX) amb un servidor node.js i SQLite.

## Instruccions d'execució
1. Instal·lar dependències: `npm install`
2. Executar el servidor: `npm start`
3. Obrir `index.html` al navegador.

## Característiques implementades
- S'ha inclòs un sistema de validació mitjançant **Expressions Regulars (Regex)** que impedeix afegir vehicles si el text introduït no correspon a una matrícula vàlida (format 0000XXX). S'ha partit de matrícules espanyoles les quals no contenen vocals.
- S'inclou un sistema que detecta si l'aplicació està connectada amb l'endpoint.
- S'han inclòs 6 botons (2 per cada dada d'un vehicle) per a ordenar els resultats de forma ascendent o descendent.
- S'ha inclòs un cercador per localitzar vehicles que, en cas de rebre una matrícula amb el format indicat al punt 1, cercarà per matrícula, en qualsevol altre cas cercarà per Id.
- Finalment s'ha inclòs un botó per mostrar el llistat de vehicles i "resetejar" aquest a l'ordre per defecte (ascendent per Id).

## **Español**
## 📝Resumen:
Esta aplicación permite gestionar la flota de un taller mecánico utilizando comunicación asíncrona (AJAX) con un servidor node.js y SQLite.

## Instrucciones de ejecución
1. Instalar dependencias: `npm install`
2. Ejecutar el servidor: `npm start`
3. Abrir `index.html` en el navegador.

## Características implementadas
- Incluido un sistema de validación mediante **Expresiones Regulares (Regex)** que impide añadir vehículos si el texto introducido no se corresponde con una matrícula válida (formato 0000XXX). Se ha partido de matrículas españolas, las cuales no tienen vocales.
- Incluido un sistema que detecta si la aplicación está conectada al endpoint.
- Incluidos 6 botones (2 por cada dato del vehículo) para ordenar los resultados de forma ascendente o descendente.
- Incluido un buscador para localizar vehículos que, en caso de recibir una matrícula con el formato indicado en el punto 1, buscará por matrícula, en cualquier otro caso, buscará por Id.
- Finalmente, incluido un botón para mostrar el listado de vehículos y "resetear" este al orden por defecto (ascendente por Id).
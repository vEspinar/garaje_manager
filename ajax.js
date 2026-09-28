//creem les constants per a tots aquells elements que necessitem del HTML:
const connect = document.getElementById("connect");
const getVh = document.getElementById("get");
const postVh = document.getElementById("entrada");
const llista = document.getElementById("llista");
const search = document.getElementById("cercador");
const ordena = document.getElementById("order");
const urlJson= 'http://localhost:3000/garage';

//Creem constants per estalviar repetir:
const errorFormat = "La entrada no es un format vàlid.";
const lletres = new RegExp("^[A-Z]{3}$", "i");
const vocals = new RegExp("[AEIOU]","i");
const kmForm = `<br/><form id="kmetres">
            <input id="inputKm" type="text" placeholder="Introduiu un número.">
            <button type="submit" id="postKm">&#9989;</button></form>`;
const errorNaN = "No s'ha introduït un número";
const getError = "S'ha produït un error en l'obtenció de dades."
const errorEmpty = "No hi han vehicles registrats.";
const registerOk = "Vehicle registrat correctament.";
const registerError="No s'ha pogut registrar el vehicle degut a: ";
const deleteOk ='El vehicle ha sigut esborrat.';
const deleteError = "No s'ha pogut esborrar el vehicle seleccionat.";
let connection = true;

//Provem l'estat de la connexió:
checkConnection();
setInterval(() => {checkConnection();}, 2000);

async function checkConnection(){
    try{
        const test = await fetch(urlJson);
        if(test.ok){
            connection= true;
            connect.style.backgroundColor="green";
        }else{
            throw new Error();
        }
    }catch(e){
        connection= false;
        connect.style.backgroundColor = "red";
    }
}
//Creem els eventListeners que ens interesen en funció de cada possible event que volem:

//Un per llistar tots els vehicles:
getVh.addEventListener("click", async () =>{
    await orderById();
});

//Un per el submit del formulari:
postVh.addEventListener("submit", async (e) =>{
    e.preventDefault();
    try{
        const id= e.target.id;
        const dades = document.getElementById("input").value.toUpperCase();
        await entradaMatricula(dades, id);    
        document.getElementById("input").value="";
    }catch(error){
        alert(error.message);
    }
});

//Un per els clicks que es facin a la llista (per els botons de esborrar y canviar Km.)
llista.addEventListener("click", async (e) =>{
    e.stopPropagation();
    const clase = e.target.className;
    const id = e.target.id;
    if(clase === "borrar"){
        borrar(id);
        return;
    }else if(clase === "km"){
        const previ = document.getElementById("kmetres");
        if(previ){
            previ.remove();
        }
        e.target.parentElement.innerHTML += kmForm;
    }
});

//I un per el submit de la llista dels km, que fara bubbling fins la llista.
llista.addEventListener("submit", async (e) =>{
    e.preventDefault();
    try{
        let dades = document.getElementById("inputKm").value;
        if(dades===""){
            dades =0;
        }
        if(isNaN(dades)){
            alert(errorNaN);
            return;
        }
        const id = e.target.closest("li").id;
        const car = await cercador(id);
        insertKm(car.plate, dades, id);
    }catch(error){alert(error.message);}
});

//Fem un eventListener per al cercador que ens hem inventat:
search.addEventListener("submit", async (e) =>{
    e.preventDefault();
    let parameter = document.getElementById("cerca").value;
    parameter = parameter.trim();
    document.getElementById("cerca").value="";
    const car = await cercador(parameter);
    if(car){
    llista.innerHTML = `<li id="${car.id}">Id: ${car.id}, Matrícula: ${car.plate}, Kilometres: ${car.km}. 
            <div class=botons><button type='button' class='borrar' id=${car.id}>&#128465;</button>
            <button type='button' class='km' id=${car.id}>&#9997;Km</button></div></li>`;
    }
})

//Fem un EventListener per als botons encarregats de ordenar els resultats:
ordena.addEventListener("click", async (e) =>{
    e.stopPropagation();
    if(e.target.id === "byIdUp"){
        orderById();
        return;
    }
    if(e.target.id === "byPlateUp"){
        orderByPlate();
    }
    if(e.target.id === "byKmUp"){
        orderByKm();
    }
    if(e.target.id ==="byIdDown"){
        orderByIdDown();
    }
    if(e.target.id ==="byPlateDown"){
        orderByPlateDown();
    }
    if(e.target.id ==="byKmDown"){
        orderByKmDown();
    }
})

//Una vegada estan fets els listeners, farem els mètodes que es cridaran cada vegada que s'activi un listener.
//Primer, farem una funció per cridar la bbdd i GET la informació en format JSON.
async function call(){
    //Cridem amb un await el fetch 
    const response = await fetch(urlJson);
    //Si la resposta no es ok, que salti error i surti.
    if(!response.ok){
        throw new Error(getError);
    }
    //Si no, continua i transformem la resposta a json abans de retornar-la.
    const data = await response.json();
    return data;
}

//Fem un nou mètode per a registrar nous vehicles que demanarà el paràmetre matrícula tal com hem programat a dalt.
async function entradaMatricula(matricula){
    //Comprovem que es correcte amb el validador:
    if(!validatePlate(matricula)){
        alert(errorFormat);
        return;
    }
    //si tot és correcte, cridem la funció call() per veure si ja està registrada la matrícula.
    const data = await call();
    //Intentem declarar un vehicle que mirarà si dins de les dades rebudes de call() existeix la matrícula aportada.
    const vehicle = data.find(element => element.plate === matricula);
    //si troba el vehicle, indicarem amb un alert l'id del vehicle ja registrat. Si no el troba, serà undefined.
    if(vehicle){
        alert(`La matricula ${matricula} ja es troba registrada amb l'id: ${vehicle.id}.`);
        return;
    }
    //Si el vehicle es undefined o null, afegirem la matrícula amb un fetch-POST amb km: 0
    const opRes = await fetch(urlJson, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({plate: matricula, km: 0})
    })
    //Comprovem que la resposta es ok i farem un alert tan si com no indicant el resultat.
    if(opRes.ok){
        alert(registerOk);
        //si s'ha registrar, farem un listCars() per actualitzar la llista amb el vehicle nou.
        orderById();
    }else{
        alert(registerError+opRes.status);
    }
}

//Creem un nou mètode per modificar el kilometratge de un vehicle que demanarà com a paràmetres la matrícula, els kms nous i l'id del vehicle.
async function insertKm(plate, kms, id){
    console.log(id);
    //Amb tota la informació obtinguda, farem un fetch-PUT per modificar una entrada existent.
    const opRes = await fetch(`${urlJson}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: id, plate: plate, km: kms})
    })
    if(opRes.ok){
        alert("Dades modificades.");
        orderById();
    }else{
        alert("No s'ha pogut modificar les dades degut a: "+opRes.status);
    }
}


//Creem una funciò asíncrona per tal de buscar vehicles per ID i fer més fàcil altres mètodes.

async function cercador(parameter){
    //primer cridem tots els vehicles registrats. Envoltarem amb un try-catch per el throw a call()
    parameter = parameter.trim();
    try{
        const llist = await call();
        //i mirem de guardar un vehicle amb l'id aportat.
        let vehicle;
        let dada;
        if(validatePlate(parameter)){
            vehicle = llist.find(car => car.plate==parameter.toUpperCase())
            dada = "La matrícula";
        }else{
            vehicle = llist.find(car => car.id==parameter);
            dada = "L'id";
        }
        //Si no es troba l'id a la llista, el vehicle serà null o undefined.
        if(!vehicle){
            alert(`${dada} ${parameter} no existeix a la base de dades.`)
            return;
        }
        //en cas contrari, retornem el vehicle.
        return vehicle;
    }catch(error){
        alert(error.message);    
    }
}

//Fem un mètode nou per esborrar un vehicle a partir del paràmetre id
async function borrar(id){
    console.log(id);
    //Fem un fetch-delete
    const opRes = await fetch(`${urlJson}/${id}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"}
    })
    //Farem un alert per si la resposta es ok o no.
    if(!opRes.ok){
        alert(deleteError);
    }else{
        alert(deleteOk);
        //En cas que sigui ok, fem un listCars per actualitzar la llista.
        orderById();
    }
}

//Creem una funció per validar les matricules que ens servirà per entrar-les i cercar-les:
function validatePlate(matricula){
    if(matricula.length !== 7){
        return false;
    //i comprovem que els 4 primers caràcters son dígits.
    }else {
        const nums = matricula.slice(0,4);
        const letters = matricula.slice(4,7).toUpperCase();
        if(isNaN(nums)){
            return false;
        //i que els tres últims son lletres que no són vocals.
        }else if(!lletres.test(letters)||vocals.test(letters)){
        return false;
        }else{
            return true;
        }
    }
}

//Fem una serie de mètodes similars per a ordenar els resultats que es mostraran a la web.
//Per defecte sempre farem servir orderById().
async function orderById(){
    try{
        const data = await importList();
        if(data){
            const ordered = data.sort((a,b) => a.id - b.id);
            listCars(ordered);
        }
    }catch(e){
        alert(e.message);
    }
}
async function orderByIdDown(){
    try{
        const data = await importList();
        if(data){
            const ordered = data.sort((a,b) => b.id - a.id);
            listCars(ordered);
        }
    }catch(e){
        alert(e.message);
    }
}

async function orderByPlate(){
    try{
        const data = await importList();
        if(data){
            const ordered = data.sort((a,b) => a.plate.localeCompare(b.plate));
            listCars(ordered);
        }
    }catch(e){
        alert(e.message);
    }
}
async function orderByPlateDown(){
    try{
        const data = await importList();
        if(data){
            const ordered = data.sort((a,b) => b.plate.localeCompare(a.plate));
            listCars(ordered);
        }
    }catch(e){
        alert(e.message);
    }
}
async function orderByKm(){
    try{
        const data= await importList();
        if(data){
            const ordered = data.sort((a,b) => a.km - b.km);
            listCars(ordered);
        }
    }catch(e){alert(e.message);}
}
async function orderByKmDown(){
    try{
        const data= await importList();
        if(data){
            const ordered = data.sort((a,b) => b.km - a.km);
            listCars(ordered);
        }
    }catch(e){alert(e.message);}
}

//Creem un métode que mostrará els vehicles com entrin per paràmetre.
function listCars(data) {
        //I primer buidem el div llista per no repetir dades.
        llista.innerHTML ="";
        //Creem una variable per anar encadenant les entrades.
        let text = "";
        //I fem un bucle per anar afegint cada vehicle a la variable amb els seus botons.
        data.forEach((car) => {
            //I afegirem al div llista de l'HTML amb format HTML i afegint els botons de borrar i km amb el mateix id que el vehicle.
            text += `<li id="${car.id}">Id: ${car.id}, Matrícula: ${car.plate}, Kilometres: ${car.km}. 
            <div class=botons><button type='button' class='borrar' id=${car.id}>&#128465;</button>
            <button type='button' class='km' id=${car.id}>&#9997;Km</button></div></li>`;
        })
        //Afegim tot aquesta llista a l'apartat corresponent del nostra html.
        llista.innerHTML = text;
        //I mostrem l'apartat si no ho habiem fet.
        llista.style.display = "unset";
}

//Creem una funció que retorni les dades
async function importList() {
    //Envoltem amb un try-catch per el throw que hem programat a call()
    try{
        //Cridem la funció call i comprovem que no sigui buida (en cas que sigui buida fem un alert indicant-ho)
        const data = await call(); 
        //Si no hi han dades, que salti alerta.
        if(data.length===0){
            alert(errorEmpty);
            return;
        }
        //si hi han dades, que les retorni en forma de Array.
        return data;
    }catch(error){
        alert(error.message);
    }
}
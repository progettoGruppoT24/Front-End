const dotenv = require('dotenv').config();  //per usare le variabili di ambiente

//------------------------------------FUNZIONI DI SUPPORTO-------------------------------------------------
function checkPassword(newPassword){
    //NON FUNZIONA, DA CONTROLLARE COME MAI

    //Logica del controllo password, verifica se soddisfa i requisiti oppure no
    //console.log("siamo in checkPassword");

    var test=null;
    var nCaratteri = newPassword.length;
    var nMaiuscole = 0, nMinuscole = 0, nCifre = 0, nCaratteriSpeciali = 0;
    
    for(var i = 0; i < nCaratteri; i++){
        
        test=newPassword.charAt(i); //ritorna il carattere in posizione i

        if(test >= '0' && test <= '9'){
            //se vera il carattere è un numero
            //console.log("Il carattere " + test + " è un numero");
            nCifre++;
        }
        if(test >= 'a' && test <= 'z'){
            //se vera il carattere è una lettera maiuscola
            //console.log("Il carattere " + test + " è una lettera minuscola");
            nMinuscole++;
        }
        if(test >= 'A' && test <= 'Z'){
            //il carattere è una lettera minuscola
            //console.log("Il carattere " + test + " è una lettera maiuscola");
            nMaiuscole++;
        }
        if(test == '#' || test == '$' || test == '£' || test == '@' || test == '!' || test == '?' || test == '-' || test == '_' || test == ':' || test == '.'){
            //il carattere non è ne lettera ne numero
            //console.log("Il carattere " + test + " è un carattere speciale");
            nCaratteriSpeciali++;
        }
    }

    if(nCaratteri < 8)  return false;
    if(nCifre < 2)  return false;
    if(nCaratteriSpeciali < 1)  return false;
    if(nMinuscole < 1 || nMaiuscole < 1)    return false;
    if(nCaratteri != (nCifre + nMaiuscole + nMinuscole + nCaratteriSpeciali))   return false;
        //Se inserisce caratteri che non rientrano tra le lettere, i numeri o i caratteri speciali da noi scelti

    return true;
}

function getRandomString() {

    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 8; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function sendEmail(){

    async function sendNewEmail(){
    
        const response = await fetch(process.env.SERVER + 'sendEmail');
    
        const myJson = await response.json();

        if(myJson.success){
            //console.log("successo");
        }
        else{
            //console.log("insuccesso");
        }
        window.location = "#";
        return;
    }

    sendNewEmail();
    
}

//------------------------------------FUNZIONI CHE INVOCANO LE API-----------------------------------------

function login(){
    var username = document.getElementById("loginUsername").value;
    var password = document.getElementById("loginPassword").value;

    if(username != "" && password != ""){
        //console.log("User = " + username + ", pass = " + password);

        async function verificaUtenteRegistrato(){
    
            const response = await fetch(process.env.SERVER + 'login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, password: password })
            })
        
            const myJson = await response.json();
    
            //console.log(myJson.message);
            //console.log(myJson);


            if(myJson.success){
                if(username!==myJson.username){
                    var description = document.getElementById("description");
                    description.innerHTML = "Username o password errati";
                    window.location = "#";
                }
                else{
                    localStorage.setItem("username", myJson.username);
                    localStorage.setItem("isPremium", myJson.isPremium);
                    //window.location = "#";
                    window.location = "../index.html";
                }
            }
            else{
                var description = document.getElementById("description");
                description.innerHTML = "Username o password errati";
                window.location = "#";
            }
            return;
        }

        verificaUtenteRegistrato();
    }
    else{
        document.getElementById("description").textContent = "Inserisci sia username che password";
        window.location = "#";
    }
    

  
}

function registraUtente(){
    var iUsername = document.getElementById("inputUsername").value;
    var iEmail = document.getElementById("inputEmail").value;
    var iPassword = document.getElementById("inputPassword").value;
    var iNation = document.getElementById("inputNation").value;

    if(iPassword != document.getElementById("inputConfirmPassword").value){
        document.getElementById("description").textContent = "Le due password non coincidono";
        window.location="#";
        return;
    }

    if(!checkPassword(iPassword)){
        document.getElementById("description").textContent = "La password non rispetta i requisiti minimi";
        window.location="#";
        return;
    }

    if(iUsername != "" && iEmail != "" && iPassword != "" && iNation != ""){
        async function registraUtente(){
    
            const response = await fetch(process.env.SERVER + 'signUp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: iUsername, 
                    email: iEmail,
                    password: iPassword,
                    nation: iNation
                })
            })
        
            const myJson = await response.json();
    
            //console.log(myJson.message);
            //console.log(myJson);
    
            if(myJson.success){
                const response = await fetch(process.env.SERVER + 'login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: iUsername, password: iPassword })
                })
            
                const myJson = await response.json();
        
                if(myJson.success){
                    localStorage.setItem("username", myJson.username);
                    localStorage.setItem("token", myJson.token);
                    window.location = "../index.html";
                }
                else{
                    //Non dovrebbe mai accadere
                    document.getElementById("description").textContent = "Si è verificato un errore";
                    window.location = "#";
                }
            }
            else{
                document.getElementById("description").textContent = "Errore: " + myJson.message;
                window.location = "#";
            }
            return;
        }

        registraUtente();
    }
    else{
        document.getElementById("description").textContent = "Compila tutti i campi";
        window.location="#";
        return; 
    }

    
}

function setDatiUtente(pUsername){

    async function getDatiUtente(){
    
        const response = await fetch(process.env.SERVER + 'getDatiUtente/' + pUsername);
    
        const myJson = await response.json();

        if(myJson.success){
            document.getElementById("profiloUsername").textContent = "Username: " + pUsername;   
            document.getElementById("profiloEmail").textContent = "Email: " + myJson.dati.email;   
            //document.getElementById("profiloPassword").textContent = "Password: " + myJson.dati.password;   
            document.getElementById("profiloNazione").textContent = "Nation: " + myJson.dati.nation;   
            if(myJson.dati.isPremium){
                document.getElementById("profiloPremium").textContent = "Premium user";   
                document.getElementById("premiumButton").setAttribute("style", "display:none");
            }
            else{
                document.getElementById("profiloPremium").textContent = "Normal user";   
            }
        }
        else{
            //Non dovrebbe mai accadere, non può non esistere l'utente se la richiesta dei dati avviene dal profilo
            document.getElementById("descrizioneProfilo").setAttribute("style", "display:inline");
            document.getElementById("descrizioneProfilo").textContent = "Errore, utente inesistente";            
        }
        window.location = "#";
        return;
    }

    getDatiUtente();
}

function setStatisticheUtente(pUsername){

    async function getStatisticheUtente(){
    
        const response = await fetch(process.env.SERVER + 'getStatisticheUtente/' + pUsername);
    
        const myJson = await response.json();

        if(myJson.success){
            document.getElementById("profiloSGG").textContent = "Sfide giornaliere giocate: " + myJson.dati.statisticheUtente.sfideGiornaliereGiocate;   
            document.getElementById("profiloSGV").textContent = "Sfide giornaliere vinte: " + myJson.dati.statisticheUtente.sfideGiornaliereVinte;   
        }
        else{
            //Non dovrebbe mai accadere, non può non esistere l'utente se la richiesta dei dati avviene dal profilo
            document.getElementById("descrizioneStatistiche").textContent = "Errore, utente inesistente";            
        }
        window.location = "#";
        return;
    }

    getStatisticheUtente();
}

function setProfilo(){
    var pUsername = localStorage.getItem("username");

    if(pUsername == "null"){
        window.location="./login.html";
        return;
    }

    setDatiUtente(pUsername);
    setStatisticheUtente(pUsername);
}

function setNewEmail(){

    var username = localStorage.getItem("username");

    if(username == "null"){
        window.location="./login.html";
        return;
    }

    var nuovaEmail = document.getElementById("nuovaEmail").value;

    if(nuovaEmail != ""){
        async function setEmail(){    
            const response = await fetch(process.env.SERVER + 'setNuovaEmail/' + username + "/" + nuovaEmail, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({  })
            });
        
            const myJson = await response.json();
    
            if(myJson.success){
                document.getElementById("descrizioneEmail").textContent = "Email cambiata, nuova email: " + nuovaEmail;  
            }
            else{
                //Nel caso ci sia un errore nella richiesta
                document.getElementById("descrizioneEmail").textContent = "Si è verificato un errore, riprova";  
            }
            window.location = "#";
            setProfilo();
            return;
        }
    
        setEmail();
    }
    else{
        document.getElementById("descrizioneEmail").textContent = "Inserisci un'email";  
    }

    
    


}

function setNewPassword(){
    var username = localStorage.getItem("username");

    if(username == "null"){
        window.location="./login.html";
        return;
    }

    var vecchiaPassword = document.getElementById("vecchiaPassword").value;
    var nuovaPassword = document.getElementById("nuovaPassword1").value;

    if(nuovaPassword == document.getElementById("nuovaPassword2").value && vecchiaPassword != "" && nuovaPassword != ""){

        if(checkPassword(nuovaPassword)){
            async function setPassword(){    
                const response = await fetch(process.env.SERVER + 'setNuovaPassword/' + username + "/" + nuovaPassword, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ vecchiaPassword: vecchiaPassword })
                });
            
                const myJson = await response.json();
        
                if(myJson.success){
                    document.getElementById("descrizionePassword").textContent = "Password cambiata";//, nuova password: " + nuovaPassword;  
                }
                else{
                    //Nel caso ci sia un errore nella richiesta
                    document.getElementById("descrizionePassword").textContent = myJson.message;  
                }
                window.location = "#";
                setProfilo();
                return;
            }
            setPassword();
        }
        else{
            document.getElementById("descrizionePassword").textContent = "La password non rispetta i requisiti minimi";
        }

        
    }
    else{
        if(vecchiaPassword == "" || nuovaPassword == ""){
            document.getElementById("descrizionePassword").textContent = "Compila tutti i campi";
        }
        else{
            document.getElementById("descrizionePassword").textContent = "Le due password non coincidono";
        }
    }

    
}

function upgradePremium(){

    var username = localStorage.getItem("username");

    if(username == "null"){
        window.location="./login.html";
        return;
    }

    async function upPremium(){    
        const response = await fetch(process.env.SERVER + 'upgradePremium/' + username, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ })
        });
    
        const myJson = await response.json();

        if(myJson.success){
            document.getElementById("profiloPremium").textContent = "Premium user";
            localStorage.setItem("isPremium", true);
            document.getElementById("premiumButton").setAttribute("style", "display:none");
            document.getElementById("descrizioneProfilo").textContent = "Upgrade avvenuto con successo";  
        }
        else{
            //Nel caso ci sia un errore nella richiesta
            document.getElementById("descrizioneProfilo").textContent = myJson.message;  
        }
        window.location = "#";
        setProfilo();
        return;
    }
    upPremium();
}

function recuperaCredenziali(){
    const emailRecupero = document.getElementById("emailRecupero").value;

    async function recuperaDatiEInoltrali(){

        const response1 = await fetch(process.env.SERVER + 'getCredenziali/' + emailRecupero);

        const myJson1 = await response1.json();
        //console.log(myJson1);

        if(myJson1.success){

            const nuovaPassword = getRandomString();

            //console.log("La nuova password generata è: " + nuovaPassword);

            async function setPassword(){    
                const response = await fetch(process.env.SERVER + 'setNuovaPassword/' + myJson1.dati.username + "/" + nuovaPassword, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ vecchiaPassword: myJson1.dati.password })
                });
            
                const myJson2 = await response.json();
        
                if(myJson2.success){
                    const response = await fetch(process.env.SERVER + 'sendEmail', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            destinatario: emailRecupero, 
                            titolo: "Ecco le tue credenziali",
                            testo: "Username: " + myJson1.dati.username + ", password: " + nuovaPassword
                        })
                    })
                
                    const myJson3 = await response.json();            
            
                    if(myJson3.success){
                        document.getElementById("description").textContent = "Email inviata";
                    }
                    else{
                        document.getElementById("description").textContent = "Errore nell'invio della mail";
                    }
                    return;

                }
                else{
                    document.getElementById("description").textContent = myJson2.message; 
                    return;
                }
                window.location = "#";
                return;
            }
            setPassword();

        }
        else{
            document.getElementById("description").textContent = "L'email inserita non corrisponde a nessun utente";
            return;
        }        
    }

    recuperaDatiEInoltrali();

}






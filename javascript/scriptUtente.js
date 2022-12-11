/*
function getUrlParameter(key){
//Funzione per leggere da una richiesta html
var queryString = window.location.search.substring(1);
var vars = queryString.split('&');
for(var i = 0; i < vars.length; i++){
    var pair = vars[i].split('=');
    if(pair[0] == key){
        return pair[1];
    }
}
}
*/

//const e = require("express");

//------------------------------------FUNZIONI DI SUPPORTO-------------------------------------------------
function checkPassword(newPassword){
    //Logica del controllo password, verifica se soddisfa i requisiti oppure no
    return true;
}

//------------------------------------FUNZIONI CHE INVOCANO LE API-----------------------------------------

function login(){
    var username = document.getElementById("loginUsername").value;
    var password = document.getElementById("loginPassword").value;

    if(username != "" && password != ""){
        //console.log("User = " + username + ", pass = " + password);

        async function verificaUtenteRegistrato(){
    
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, password: password })
            })
        
            const myJson = await response.json();
    
            //console.log(myJson.message);
            //console.log(myJson);

    
            if(myJson.success){
                localStorage.setItem("username", myJson.username);
                localStorage.setItem("token", myJson.token);
                //window.location = "#";
                window.location = "../indexUtenteRegistrato.html";
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

function logout(){
    localStorage.setItem("username", null);
    localStorage.setItem("token", null);
    window.location = "index.html";
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
    
            const response = await fetch('http://localhost:8080/signUp', {
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
                const response = await fetch('http://localhost:8080/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: iUsername, password: iPassword })
                })
            
                const myJson = await response.json();
        
                if(myJson.success){
                    localStorage.setItem("username", myJson.username);
                    localStorage.setItem("token", myJson.token);
                    window.location = "../indexUtenteRegistrato.html";
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

function datiUtente(){
    var pUsername = localStorage.getItem("username");

    async function getDatiUtente(){
    
        const response = await fetch('http://localhost:8080/getDatiUtente/' + pUsername);
    
        const myJson = await response.json();

        if(myJson.success){
            document.getElementById("profiloUsername").textContent = "Username: " + pUsername;   
            document.getElementById("profiloEmail").textContent = "Email: " + myJson.dati.email;   
            document.getElementById("profiloPassword").textContent = "Password: " + myJson.dati.password;   
            document.getElementById("profiloNazione").textContent = "Nation: " + myJson.dati.nation;   
            if(myJson.dati.isPremium){
                document.getElementById("profiloPremium").textContent = "Premium user";   
            }
            else{
                document.getElementById("profiloPremium").textContent = "Normal user";   
            }
        }
        else{
            //Non dovrebbe mai accadere, non può non esistere l'utente se la richiesta dei dati avviene dal profilo
            document.getElementById("descrizioneProfilo").textContent = "Errore, utente inesistente";            
        }
        window.location = "#";
        return;
    }

    getDatiUtente();
}

function statisticheUtente(){
    var pUsername = localStorage.getItem("username");

    async function getStatisticheUtente(){
    
        const response = await fetch('http://localhost:8080/getStatisticheUtente/' + pUsername);
    
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
    datiUtente();
    statisticheUtente();
}

function setNewEmail(){

    var username = localStorage.getItem("username");
    var nuovaEmail = document.getElementById("nuovaEmail").value;

    async function setEmail(){    
        const response = await fetch('http://localhost:8080/setNuovaEmail/' + username + "/" + nuovaEmail, {
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
        return;
    }

    setEmail();

}

function setNewPassword(){
    var username = localStorage.getItem("username");
    var nuovaPassword = document.getElementById("nuovaPassword1").value;

    if(nuovaPassword == document.getElementById("nuovaPassword2").value && nuovaPassword != ""){

        if(checkPassword(nuovaPassword)){
            async function setPassword(){    
                const response = await fetch('http://localhost:8080/setNuovaPassword/' + username + "/" + nuovaPassword, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({  })
                });
            
                const myJson = await response.json();
        
                if(myJson.success){
                    document.getElementById("descrizionePassword").textContent = "Password cambiata, nuova password: " + nuovaPassword;  
                }
                else{
                    //Nel caso ci sia un errore nella richiesta
                    document.getElementById("descrizionePassword").textContent = "Si è verificato un errore, riprova";  
                }
                window.location = "#";
                return;
            }
        
            setPassword();
        }
        else{
            document.getElementById("descrizionePassword").textContent = "La password non rispetta i requisiti minimi";
        }

        
    }
    else{
        if(nuovaPassword == ""){
            document.getElementById("descrizionePassword").textContent = "Compila entrambi i campi";
        }
        else{
            document.getElementById("descrizionePassword").textContent = "Le due password non coincidono";
        }
    }

    
}








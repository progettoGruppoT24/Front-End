function logout(){
    localStorage.setItem("username", null);
    localStorage.setItem("token", null);
    window.location = "index.html";
}

function setPage(){
    var username = localStorage.getItem("username");
    
    if(username == "null"){
        document.getElementById("userInformation").innerHTML = "Utente anonimo";
        document.getElementById("logoutButton").setAttribute("style", "display:none");
        document.getElementById("profileButton").setAttribute("style", "display:none");
        document.getElementById("dailyChallenge").disabled = true;
        document.getElementById("checkKanji").disabled = true;
    }
    else{        
        document.getElementById("userInformation").innerHTML = "Utente: " + username;
        document.getElementById("loginButton").setAttribute("style", "display:none");
        document.getElementById("dailyChallenge").disabled = false;
        document.getElementById("checkKanji").disabled = true;
        if(localStorage.getItem("isPremium")=="true")
            document.getElementById("checkKanji").disabled = false;
    }
}

function openSinglePlayerWindow(){
    const updateButton = document.getElementById("buttonSinglePlayer");
    const cancelButton = document.getElementById("cancel");
    const dialog = document.getElementById("singleplayer");
    dialog.returnValue = "singleplayer";
    dialog.show();
    
    // Update button opens a modeless dialog
    updateButton.addEventListener("click", () => {
        dialog.show();
    });

    // Form cancel button closes the dialog box
    cancelButton.addEventListener("click", () => {
        dialog.close("");
    });
}; 

function playTraining(){
    var url = "./training_quiz.html";
    var hiraganaBool = document.getElementById("checkHiragana");
    var katakanaBool = document.getElementById("checkKatakana");
    var kanjiBool = document.getElementById("checkKanji");
    
    //console.log(kanjiBool.checked);
    if(hiraganaBool.checked&&!katakanaBool.checked&&!kanjiBool.checked){ //1 0 0
        url = url + "?alfabeto=[\"Hiragana\"]";
    }
    else if(hiraganaBool.checked&&katakanaBool.checked&&!kanjiBool.checked){ //1 1 0
        url = url + "?alfabeto=[\"Hiragana\", \"Katakana\"]";
    }
    else if(hiraganaBool.checked&&katakanaBool.checked&&kanjiBool.checked){ // 1 1 1
        url = url + "?alfabeto=[\"Hiragana\", \"Katakana\", \"Kanji\"]";
    }
    else if(hiraganaBool.checked&&!katakanaBool.checked&&kanjiBool.checked){ //1 0 1
        url = url + "?alfabeto=[\"Hiragana\", \"Kanji\"]";
    }
    else if(!hiraganaBool.checked&&katakanaBool.checked&&!kanjiBool.checked){ //0 1 0
        url = url + "?alfabeto=[\"Katakana\"]";
    }   
    else if(!hiraganaBool.checked&&katakanaBool.checked&&kanjiBool.checked){ //0 1 1
        url = url + "?alfabeto=[\"Katakana\", \"Kanji\"]";
    }
    else if(!hiraganaBool.checked&&!katakanaBool.checked&&kanjiBool.checked){ //0 0 1
        url = url + "?alfabeto=[\"Kanji\"]";
    }
    else{
        url = "./index.html";
        alert("Errore nessun alfabeto selezionato");
    }
    window.location.href = url;
}

async function playDailyChallenge(){
    var response = await fetch("https://JGuesser-BackEnd-Unitn.up.railway.app/" + 'getSfidaGiornaliera');
    var resp = await response.json();
    response = await fetch("https://JGuesser-BackEnd-Unitn.up.railway.app/" + 'setDailyChallengePlayed/' + localStorage.getItem('username'), {
        method: 'PATCH',
        body: JSON.stringify({}), // string or object
        headers: {
          'Content-Type': 'application/json'
        }
    });
    resp = await response.json();
    if(resp.message=="already_played"){
        alert("daily challenge gia giocata");
    }
    else{
        window.location.href = "./daily_challenge_quiz.html";
    }
}


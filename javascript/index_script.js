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
    
    console.log(kanjiBool.checked);
    if(hiraganaBool.checked&&!katakanaBool.checked&&!kanjiBool.checked){ //1 0 0
        url = url + "?alfabeto=[\"Hiragana\"]";
    }
    else if(hiraganaBool.checked&&katakanaBool.checked&&!kanjiBool.checked){ //1 1 0
        url = url + "?alfabeto=[\"Hiragana\", \"Katakana\"]";
    }
    else if(hiraganaBool.checked&&!katakanaBool.checked&&kanjiBool.checked){ // 1 1 1
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

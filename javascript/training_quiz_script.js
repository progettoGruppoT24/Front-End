var quizToShow;
var contPoints = 0;
            
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function setQuiz(){
    const secQuiz1 = document.getElementById("quiz1");
    const secQuiz23 = document.getElementById("quiz23");
    const rispEsatta = document.getElementById("rispostaEsatta");
    const domanda = document.getElementById("domanda");
    
    const o1 = document.getElementById("o1");
    const o2 = document.getElementById("o2");
    const o3 = document.getElementById("o3");
    const o4 = document.getElementById("o4");
    
    const queryString = window.location.search;
    
    const response = await fetch('http://localhost:8080/generaQuiz' + queryString);
    
    quizToShow = await response.json();
    console.log(quizToShow);
    
    domanda.innerHTML = "Domanda: " + quizToShow.domanda;
                    
    secQuiz1.style.display="none";
    secQuiz23.style.display="none";
    rispEsatta.style.display="none";
    if(quizToShow.tipo===1){
        secQuiz1.style.display="block";
        
    }
    else{
        secQuiz23.style.display="block";
        o1.value = quizToShow.opzione[0];
        o2.value = quizToShow.opzione[1];
        o3.value = quizToShow.opzione[2];
        o4.value = quizToShow.opzione[3];
    }
};
async function checkAnswer(ans){
    const rispEsatta = document.getElementById("rispostaEsatta");
    rispEsatta.innerHTML = 'La risposta esatta era: ' + quizToShow.soluzione;
    rispEsatta.style.display="block";
    if(ans===quizToShow.soluzione){
        const points = document.getElementById("points");
        contPoints++;
        points.innerHTML = contPoints;
    }
    await sleep (3000);
    await setQuiz();
    enableAllButton();
    
} 
function clickedO1(){
    disableAllButton();
    const o1 = document.getElementById("o1");
    o1.name = "true";
    checkAnswer(o1.value);
}
function clickedO2(){
    disableAllButton();
    const o2 = document.getElementById("o2");
    o2.name = "true";
    checkAnswer(o2.value);
}
function clickedO3(){
    disableAllButton();
    const o3 = document.getElementById("o3");
    o3.name = "true";
    checkAnswer(o3.value);
}
function clickedO4(){
    disableAllButton();
    const o4 = document.getElementById("o4");
    o4.name = "true";
    checkAnswer(o4.value);
}
function disableAllButton(){
    const submitQuiz1 = document.getElementById("submitQuiz1");
    const o1 = document.getElementById("o1");
    const o2 = document.getElementById("o2");
    const o3 = document.getElementById("o3");
    const o4 = document.getElementById("o4");
    submitQuiz1.disabled = "disabled";
    o1.disabled = "disabled";
    o2.disabled = "disabled";
    o3.disabled = "disabled";
    o4.disabled = "disabled";
}
function enableAllButton(){
    const submitQuiz1 = document.getElementById("submitQuiz1");
    const o1 = document.getElementById("o1");
    const o2 = document.getElementById("o2");
    const o3 = document.getElementById("o3");
    const o4 = document.getElementById("o4");
    submitQuiz1.disabled = false;
    o1.disabled = false;
    o2.disabled = false;
    o3.disabled = false;
    o4.disabled = false;
}
function clickedSubmit(){
    disableAllButton();
    const rispQuiz1 = document.getElementById("rispQuiz1");
    checkAnswer(rispQuiz1.value);
}
async function updatePoints(){
    if(localStorage.getItem('username')!='null'){
        const response = await fetch('http://localhost:8080/aggiornaPunteggioTraining/' + localStorage.getItem('username') + '/' + contPoints, {
    method: 'PATCH',
    body: JSON.stringify({}), // string or object
    headers: {
      'Content-Type': 'application/json'
    }
  });
        const resp = await response.json();
    }
}

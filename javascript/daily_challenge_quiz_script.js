var quizDailyChallenge;
var contError = 0;
var numDailyChallenge = 0;
            
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
    
    document.getElementById("rispQuiz1").value = "";
    
    if((quizDailyChallenge.Sfida.tipoDiSfida==1&&numDailyChallenge>=5)||(quizDailyChallenge.Sfida.tipoDiSfida==2&&numDailyChallenge>=30)){
        aggiornaPunteggio("sfidaVinta");
        window.location = "index.html";
    }
    
    domanda.innerHTML = "Domanda: " + quizDailyChallenge.Sfida.listaDiQuiz[numDailyChallenge].domanda;
                    
    secQuiz1.style.display="none";
    secQuiz23.style.display="none";
    rispEsatta.style.display="none";
    
    if(quizDailyChallenge.Sfida.listaDiQuiz[numDailyChallenge].tipo===1){
        secQuiz1.style.display="block";
        
    }
    else{
        secQuiz23.style.display="block";
        o1.value = quizDailyChallenge.Sfida.listaDiQuiz[numDailyChallenge].opzione[0];
        o2.value = quizDailyChallenge.Sfida.listaDiQuiz[numDailyChallenge].opzione[1];
        o3.value = quizDailyChallenge.Sfida.listaDiQuiz[numDailyChallenge].opzione[2];
        o4.value = quizDailyChallenge.Sfida.listaDiQuiz[numDailyChallenge].opzione[3];
    }
};
async function checkAnswer(ans){
    const rispEsatta = document.getElementById("rispostaEsatta");
    rispEsatta.innerHTML = 'La risposta esatta era: ' + quizDailyChallenge.Sfida.listaDiQuiz[numDailyChallenge].soluzione;
    rispEsatta.style.display="block";
    await sleep (1000);
    if(!(ans===quizDailyChallenge.Sfida.listaDiQuiz[numDailyChallenge].soluzione)){
        ++contError;
        if(quizDailyChallenge.Sfida.tipoDiSfida==1){
            aggiornaPunteggio("sfidaPersa");
            alert("Hai sbagliato un quiz sei fuori");
            window.location = "index.html";
        }
        if(contError>=3&&quizDailyChallenge.Sfida.tipoDiSfida==2){
            aggiornaPunteggio("sfidaPersa");
            alert("Hai sbagliato 3 quiz sei fuori");
            window.location = "index.html";
        }
    }
    await sleep (3000);
    numDailyChallenge++;
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
function timeIsOver(){
    alert("Hai finito il tempo ciccio");
    aggiornaPunteggio("sfidaPersa");
    window.location = "index.html";
}
var x = setInterval(function() {
    const time = document.getElementById("time");
    time.innerHTML = time.value;
    time.value--;
    if(time.value<-1&&quizDailyChallenge.Sfida.tipoDiSfida==2){
        timeIsOver();
        clearInterval(x);
    }
}, 1000);
async function fetchDailyChallenge(){
    if(localStorage.getItem("username")=="null")
        window.location = "./login/login.html";
    const response = await fetch("https://JGuesser-BackEnd-Unitn.up.railway.app/" + 'getSfidaGiornaliera');
    quizDailyChallenge = (await response.json());
    //console.log(quizDailyChallenge.Sfida.listaDiQuiz);
    await setQuiz();
    if(quizDailyChallenge.Sfida.tipoDiSfida==1){
        const labelTime = document.getElementById("labelTime");
        const time = document.getElementById("time");
        labelTime.style.display="block";
        time.innerHTML = 120;
        time.value = 120;
    }
}
async function aggiornaPunteggio(result){
    const response = await fetch("https://JGuesser-BackEnd-Unitn.up.railway.app/" + 'aggiornaStatsSfidaGiornaliera/' + localStorage.getItem('username') + '/' + result, {
        method: 'PATCH',
        body: JSON.stringify({}), // string or object
        headers: {
          'Content-Type': 'application/json'
        }
  });
    const resp = await response.json();
}

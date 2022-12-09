async function loadWorldRanking(){
    const response = await fetch('http://localhost:8080/getClassifica');
    const tableData = await response.json();
    const table = document.getElementById("datiClassifica");
    console.log(tableData.Classifica);
    for(var i=0;i<100&&i<tableData.Classifica.length;i++){
        var row = table.insertRow();
        var rankObj = row.insertCell(0);
        rankObj.innerHTML = (i+1);
        var nationality = row.insertCell(1);
        nationality.innerHTML = tableData.Classifica[i].nation;
        var user = row.insertCell(2);
        user.innerHTML = tableData.Classifica[i].username;
        var points = row.insertCell(3);
        points.innerHTML = tableData.Classifica[i].statisticheUtente.punteggioTraining;
    }
}
async function searchPlayer(){
    const searchField = document.getElementById("searchField");
    var table = document.getElementById("datiClassifica"); 
    table.innerHTML="";
    if(searchField.value==="")
        loadWorldRanking();
    else{
        const response = await fetch('http://localhost:8080/getGiocatoreClassifica/' + searchField.value);
        const tableData = await response.json();
        var row = table.insertRow();
        var rankObj = row.insertCell(0);
        rankObj.innerHTML = '#'
        var nationality = row.insertCell(1);
        nationality.innerHTML = tableData.nation;
        var user = row.insertCell(2);
        user.innerHTML = tableData.username;
        var points = row.insertCell(3);
        points.innerHTML = tableData.statisticheUtente.punteggioTraining;
    }
}

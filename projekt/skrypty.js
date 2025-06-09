const ile = 30;
let listat = [];
let ileslow = 1;
let dane = [];
let slowadone = false;
let slowadelay = 40;
const baseURL = 'http://localhost/projekt/';
// baseURL = 'https://192.168.3.83/projekt/';
// PAMIETAC ZE NAZWA BAZY DANYCH MA BYC WORDL

const alfabet = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M',
    'Ą', 'Ć', 'Ę', 'Ł', 'Ń', 'Ó', 'Ś', 'Ź', 'Ż'
  ];

window.onload = () => {
    genalfabet();
    extrcss();
    opisanim();
    document.querySelector('#zgaduj').addEventListener('click', zgaduj)
    document.querySelector('#ob-tekst').addEventListener('mouseover', () => {
        angy();
    })
    document.querySelector('#ob-tekst').addEventListener('mouseout', () => {
        calm();
    })
    document.querySelector('#diffchange').addEventListener('click',diffch);
    document.querySelector('#wordchange').addEventListener('click',wordch);
    document.querySelector('#restartnie').addEventListener('click', () => {restart(false,true)});
    document.querySelector('#restarttak').addEventListener('click', () => {restart(true,true)});
}

// funkcje zmieniające twarz owo
async function angy() {
    let face = ""
    switch(Math.floor(Math.random() * 3)){
        case 0: face = "Słòwórdle";break;
        case 1: face = "Sł^w^trdle";break;
        case 2: face = `Sł•w•rdle`;break
    }
    document.querySelector('#ob-tekst').innerHTML=face;
}
async function calm(){
    document.querySelector('#ob-tekst').innerHTML="Sł–w–rdle";
    await wait(500);
    document.querySelector('#ob-tekst').innerHTML="Słowordle";

       
}
//animacja napisu na początku wczytania strony
async function opisanim() {
    document.querySelector('#opis').addEventListener('click', () => { slowadelay = 5;})
    
    let button = document.querySelector('#zgaduj');
    button.disabled = true;
    let str ="Zgadnij polskie słowo wpisując różne polskie słowa"
    for(let i = 0; i < str.length; i++){
    document.querySelector('#opis').innerHTML+=str[i];
    await wait(slowadelay);
    }
    document.querySelector('#tabela').innerHTML += '<button type="button" class="button" id="startB">Start</button>';
    document.querySelector('#startB').addEventListener('click', animdostart);
}

//funkcja animacji białego kwadratu/prostokątu na początku
async function animdostart(){
    document.querySelector(`#tabela`).innerHTML = '<div id="bialy-kwadrat"></div>';
    let square = document.querySelector(`#tabela`);
    square.style.backgroundColor = 'white';
    square.style.border = '1px solid black'; 
    square.animate([
        { width: '0px', height: '0px', transform: 'rotateZ(0deg)'},
        { width: '110px', height: '150px', transform: 'rotateZ(360deg)' },
        { width: '200px', height: '300px', transform: 'rotateZ(720deg)' }
    ],{duration: 800,
        fill: 'forwards'
    })
    await wait(840);
    start();
}



//funkcja odpowiadająca za zgadywanie i odkrywanie kafelków
async function zgaduj(){
    let button = document.querySelector('#zgaduj');
    button.disabled = true; 
    let slowo = document.querySelector("#slowoja").value.toLowerCase();
    document.querySelector("#slowoja").value = '';
    console.log(slowo);
    let labelslowa = document.querySelector('#animlabel');
    
    if(slowo.length==5){
        if(matylkolitery(slowo)){
            for(let i = 0; i < slowo.length; i++){
                labelslowa.innerHTML+=`${slowo[i].toUpperCase()}`;
                await wait(40);
                }        
            labelslowa.innerHTML = `${slowo.toUpperCase()}`
    }else {
        labelslowa.innerHTML = `słowo!`;
        shakelabel()
    }
    }else {labelslowa.innerHTML = `5liter!`;
        shakelabel()
    };
    await wait(500);
    
    if(slowo.length!=5 || matylkolitery(slowo)==false){
        labelslowa.innerHTML = ' ';
        button.disabled = false;
        return;
    }

    //SPRAWDZENIE CZY SLOWO ZNAJDUJE SIĘ W DATABASE
    dane = await skrypt1(slowo);
    ///////////////
    if(dane[0]!=6){
    uniklabel();
    await wait(500);
    for(let i = ileslow; i <= ileslow+4; i++){
        rotatet(i);
        await wait(250);
        document.querySelector(`#t${i}`).innerHTML=slowo[(i-1)%5].toUpperCase();
        jedenpiec(i, dane[(i-1)%5]);


        rotatet(slowo[(i-1)%5].toUpperCase());
        await wait(250)
        jedenpiec(slowo[(i-1)%5].toUpperCase(), dane[5])
    }
    ileslow += 5;
    }else {
        labelslowa.innerHTML = `polskie!`
        shakelabel()
        await wait(1000);
        labelslowa.innerHTML = ' ';
    }

    if (dane.every(value => value === 0)){
        if(ileslow==6){
            confetti({
                particleCount: 400,
                scalar: 1.2,
                spread: 360,
                ticks: 50,
                gravity: 0,
                decay: 0.94,
                startVelocity: 30,
                shapes: ["star"],
                colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
            })
        }
        await wait(500);
        for(let i = 0; i <= 3; i++){
        confetti({
            particleCount: 300,
            spread: 90,
            origin: {x:0, y:0.9},
        });
        confetti({
            particleCount: 300,
            spread: 90,
            origin: {x:1, y:0.9},
        });
        await wait(100);
        
        }
        document.querySelector('#restartnie').addEventListener('click', () => {restart(false,true)});
        await wait(700); 
        koniecgry();
        
    }else if(ileslow<ile){
        button.disabled = false
    }else{
        await wait(100);
        document.querySelector('#restartnie').addEventListener('click', () => {restart(false,true)});
        let menulabel = document.querySelector("#menulabel");
        menulabel.innerHTML = "Przegrana! Czy chcesz zmienić słowo przy restarcie?"
        menulabel.style.fontSize = '31px';
        koniecgry();
    };
}
// funkcja podnosząca label słowa i znikająca go (gdy polskie słowo)
async function uniklabel() {
    let labelslowa = document.querySelector('#animlabel');
    labelslowa.style.display = 'inline-block';
    labelslowa.animate([
        { opacity: 1, transform: 'translateY(0px)' },  
        { opacity: 0, transform: 'translateY(-100px)' }   
    ], {
        duration: 1000,   
        easing:'cubic-bezier(0,1,0,1)',
        fill: 'backwards'
    });
    await wait(1000);
    labelslowa.style.display = 'inline';
    labelslowa.innerHTML = ' ';
}
//funkcja wstrząsająca label słowa gdy nie poprawne polskie słowo
async function shakelabel(){
    let labelslowa = document.querySelector('#animlabel');
    labelslowa.style.display = 'inline-block';
    labelslowa.animate([
        { transform: 'translateX(-5px)' },  
        { transform: 'translateX(50px)' }, 
        { transform: 'translateX(-50px)' },
        { transform: 'translateX(5px)' } 
    ], {
        duration: 500,   
        //easing:'cubic-bezier(0.1,0.9,0.5,0.9)',
        easing: 'ease-in-out',
        fill: 'backwards'
    });
    await wait(500);
    labelslowa.style.display = 'inline';
}
//funkcja do skryptu php (podstawowa komunikacja z baza danych)
// wysyłam słowo a dostaje 5 liczb, jak daleko i czy były litery w słowie 0-5
// wartość 6 oznacza ze słowo nie polskie
function skrypt1(slowo){
    console.log("skrypt1");
    random = () => Math.random() * 10000;
    let url = new URL("skrypt1.php", baseURL);
    url.searchParams.set('rand', random());
    const dodaj = {
        slowo:slowo
    }
    console.log(dodaj);
    dodajjson = JSON.stringify(dodaj);
    url.searchParams.set('json', dodajjson);
    console.log(url);
    return fetch(url, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(result => {
        console.log(`sukces: ${result}`);
        return result;
        
    })
    //.catch(error => {
    //    console.error(' haha error', error);
    //});
}

// fukcja obracająca kafelki w słowie
function rotatet(number){
    const t = document.querySelector(`#t${number}`);
    t.animate([
        {transform: "rotateY(0deg)",},{transform: "rotateY(90deg)",},{transform: "rotateY(0deg)",}
    ],{duration: 500,})
}
// funkcja od kolorów tła kafelków
function jedenpiec(number, jp){
    let clr;
    let nr = jp;
    if(nr==0){clr = "rgb(30, 255, 30)" ;       
    }else if(nr==1){clr = "rgb(220, 200, 30)";        
    }else if(nr==2){clr = "rgb(225, 190, 30)";        
    }else if(nr==3){clr = "rgb(230, 180, 30)";        
    }else if(nr==4){clr = "rgb(235, 170, 30)" ;       
    }else {clr = "rgb(200, 200, 200)"; }       
    console.log(`clr: ${clr}`)
    addCSS(`#t${number}{
            background-color: ${clr};
        }`)

}

//funkcja generująca kafelki z literami
function genalfabet(){
    tabela = "";
    for(let i = 0; i < alfabet.length; i++){
        if(alfabet[i]=='Q'||alfabet[i]=='A'||alfabet[i]=='Z'||alfabet[i]=='Ą'){ tabela +=`<div id=${alfabet[i]}${alfabet[i]}>`}
        tabela +=`<div id=t${alfabet[i]}>${alfabet[i]}</div>`;
        if(alfabet[i]=='P'||alfabet[i]=='L'||alfabet[i]=='M'||alfabet[i]=='Ż'){ tabela +=`</div>`}
        addCSS(`
            #t${alfabet[i]}{
                width: 40px;
                border-width: 1.5px;
                border-radius: 0px;
                border-color: black;
                border-style: inset;
                margin: 1px;
                font-family: sans-serif;
                font-size:38px;
                background-color: white;
                transition: transform 0.3s ;
                transition-timing-function: ease-in-out;
                float: left;
            }`
        )
        if(alfabet[i]=='Q'||alfabet[i]=='A'||alfabet[i]=='Z'||alfabet[i]=='Ą'){
            addCSS(`
                ${alfabet[i]}${alfabet[i]}{
                    display: flex;
                    flex-direction: row;
                    height: 40px;
                    width: 300px;
                    
                }`
            )

        }
    }
    document.querySelector("#tabelaalfabet").innerHTML = tabela;
    addCSS(`#tabelaalfabet{
        display: flex;
        flex-direction: column;
        position: absolute; 
        left: 50%;
        top: 750px;
        transform: translate(-50%, -100%);

        }`)
    
}

//funkcja generująca kafelki
function start(){
    tabela = "";
    for(let i = 1; i <= ile; i++){
        tabela +=`<div id=t${i}> </div>`;
        addCSS(`
            #t${i}{
                border-width: 1.5px;
                border-radius: 0px;
                border-color: black;
                border-style: inset;
                margin: 1px;
                font-family: sans-serif;
                font-size:38px;
                background-color: white;
                transition: transform 0.3s ;
                transition-timing-function: ease-in-out;
            }`
        )
    }
    document.querySelector("#tabela").innerHTML = tabela;
    for(let i = 1; i <= ile; i++){
        listat[i] = document.querySelector(`t${i}`);
    }
    addCSS(`#tabela{
    grid-area: tabela;
    display:grid;
    grid-template:
    "t1 t2 t3 t4 t5" 50px
    "t6 t7 t8 t9 t10" 50px
    "t11 t12 t13 t14 t15" 50px
    "t16 t17 t18 t19 t20" 50px
    "t21 t22 t23 t24 t25" 50px
    "t26 t27 t28 t29 t30" 50px
        /40px 40px 40px 40px 40px;
    margin-left: 10px;
    margin-right: 10px;
    }`)
    let button = document.querySelector('#zgaduj');
    button.disabled = false;
}

//funkcja zmiany do trudnosci
async function diffch(){
if (await skryptdiff(2)==1)
    {skryptdiff(0);
}else{
    skryptdiff(1);
}
let menulabel = document.querySelector("#menulabel");
menulabel.innerHTML = "Zmiana Trybu gry! Czy chcesz wymusić zmianę słowa?"
menulabel.style.fontSize = '31px';
document.querySelector('#restartnie').addEventListener('click', () => {restart(false,true)});
koniecgry();
}

// funkcja do skryptu diff

function skryptdiff(jakiez){
    console.log("skrypt4");
    random = () => Math.random() * 10000;
    let url = new URL("skryptdiff.php", baseURL);
    url.searchParams.set('rand', random());
    const dodaj = {
        jakiez:jakiez
    }
    console.log(dodaj);
    dodajjson = JSON.stringify(dodaj);
    url.searchParams.set('json', dodajjson);
    console.log(url);
    return fetch(url, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(result => {
        console.log(`sukces: ${result}`);
         return result;
        
    })
}

// funkcja do dekoracji trybu extreme
async function extrcss(){

    if(await skryptdiff(2)!=1){
    addCSS(
        `
        body{
        animation-name: backcolextr;
         background-blend-mode:overlay;
         }

        header{background-image: linear-gradient(to bottom, red, orange );}
        `
    )
    document.querySelector('#firediv').innerHTML = `<img id="firetxt" src="img/FireText.gif" alt="🔥🔥🔥🔥🔥🔥"></img>`
    }
}

//funkcja konczonca gre
async function koniecgry(){
    await wait(100);
    console.log("koniecgry");
    let menu = document.querySelector("#menu");
    let background = document.querySelector("#background");
    background.style.display = "block";
    background.animate([
        {backgroundColor: `rgba(0, 0, 0, 0.5)`},
    ],{duration: 600,
        fill: 'forwards'
    })
    menu.animate([
        {transform: 'translate(-50%,300px)'},
    ],{duration: 600,
        fill: 'forwards',
        easing: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)' 
    })
    
}

// funkcja ponawiająca gre z losowaniem kolejnego i bez
async function restart(bool, ifreload){
    if(bool){
    console.log("skryptlosid");
    random = () => Math.random() * 10000;
    let url = new URL("skryptlosid.php", baseURL);
    url.searchParams.set('rand', random());
    console.log(url);
    fetch(url, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(result => {
        console.log(`sukces: ${result}`);
        
        
    })
    }
    let menu = document.querySelector("#menu");
    menu.animate([
        {transform: 'translate(-50%,-50%)'},
    ],{duration: 600,
        fill: 'forwards',
        easing: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)' 
    })
    if (!ifreload){
        let background = document.querySelector("#background");
        background.animate([
            {backgroundColor: `rgba(0, 0, 0, 0)`},
        ],{duration: 600,
            fill: 'forwards'
        })
        await wait(800);
        background.style.display = "none";
    }

    await wait(800);
    if (ifreload){
    location.reload(true);
    }
}

// funkcja do przycisku zmiany slowa
function wordch(){
    let menulabel = document.querySelector("#menulabel");
    menulabel.innerHTML = "Zmiana Słowa! Czy chcesz wylosować nowe słowo?"
    menulabel.style.fontSize = '31px';
    document.querySelector('#restartnie').addEventListener('click', () => {restart(false,false)});
    koniecgry();
}
// funkcje dodatkowe wykorzystywane przez inne funkcje

const addCSS = css => document.head.appendChild(document.createElement("style")).innerHTML=css;
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function matylkolitery(str) {
    return /^[A-Za-zĄĘÓŚŁŻŹĆŃąćęóśłżźćń]+$/.test(str);
}

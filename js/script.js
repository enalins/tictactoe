let circle = '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-circle fa-w-16" style="height: 100% ;margin-bottom: -1px;"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z" class=""></path></svg>';

let times = '<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg-inline--fa fa-times fa-w-10 fa-2x" style="height: 100% ;margin-bottom: -5px;"><path d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z" class=""></path></svg>';

// Tebuleiro do jogo
var tabuleiro = [];
// Jogadas possíveis
var possiveis = ['1x1', '1x2', '1x3', '2x1', '2x2', '2x3', '3x1', '3x2', '3x3'];
// Conjuntos de jogadas que define uma vitória
let vitorias = [{a: '1x1', b: '1x2', c: '1x3'}, {a: '2x1', b: '2x2', c: '2x3'}, {a: '3x1', b: '3x2', c: '3x3'}, {a: '1x1', b: '2x1', c: '3x1'}, {a: '1x2', b: '2x2', c: '3x2'}, {a: '1x3', b: '2x3', c: '3x3'}, {a: '1x1', b: '2x2', c: '3x3'}, {a: '1x3', b: '2x2', c: '3x1'}];

let placHuman = 0;
let placRobot = 0;

function addOne(x){
  if(x == 'human'){
    placHuman++;
  }else if(x == 'machine'){
    placRobot++;
  }
  document.getElementById('human').textContent = placHuman;
  document.getElementById('machine').textContent = placRobot;
}

// Checa se a jogada é válida
function check(x){
  if(possiveis.includes(x) == true){
    return true;
  }else{
    return false;
  }
}

// Jogada do humano
function jogada(x){
  var ID = x.id;
  if(check(ID)){
    x.style.backgroundColor = "var(--azul)";
    x.innerHTML = times;
    tabuleiro.push({move: ID, player: 'human'});
    possiveis.splice(possiveis.indexOf(ID), 1);
    document.getElementById("waitBox").style.display = 'block';
    if(win('human')){
      addOne('human');
      alert('Fim de Jogo - Você venceu!');
    }else if(possiveis.length == 0){
      // Ninguém ganhou - empate
      alert('Fim de jogo - Nenhum vencedor.');
    }else{
      setTimeout(function(){
        // Jogada do robo
        let move = choice();
        document.getElementById(move).innerHTML = circle;
        document.getElementById(move).style.backgroundColor = "var(--amarelo)";
        tabuleiro.push({move: move, player: 'robot'});
        possiveis.splice(possiveis.indexOf(move), 1);
        if(win('robot')){
          addOne('machine');
          alert('Fim de Jogo - Você perdeu! Vitória das maquinas!');
        }else{
          document.getElementById('waitBox').style.display = 'none';
        }
      }, 1000);
    }
  }
}

// Checagem de vitória
function win(x){
  let len = vitorias.length;

  for(i = 0; i < len; i++){
    let teste1 = tabuleiro.some(tabuleiro => tabuleiro.move == vitorias[i].a && tabuleiro.player == x);
    let teste2 = tabuleiro.some(tabuleiro => tabuleiro.move == vitorias[i].b && tabuleiro.player == x);
    let teste3 = tabuleiro.some(tabuleiro => tabuleiro.move == vitorias[i].c && tabuleiro.player == x);

    if(teste1 === true && teste2 === true && teste3 === true){
      return true;
    }
  }
}

// Define a jogada ideal para a maquina
function choice(){
  
  // Função para checar se a máquina está prestes a vencer, caso sim ela ignora o resto do tabuleiro e faz a jogada vitoriosa
  function victory(){
    let len = vitorias.length;

    for(i = 0; i < len; i++){
      let teste1 = tabuleiro.some(tabuleiro => tabuleiro.move == vitorias[i].a && tabuleiro.player == 'robot');
      let teste2 = tabuleiro.some(tabuleiro => tabuleiro.move == vitorias[i].b && tabuleiro.player == 'robot');
      let teste3 = tabuleiro.some(tabuleiro => tabuleiro.move == vitorias[i].c && tabuleiro.player == 'robot');

      if(teste1 && teste2 && check(vitorias[i].c)){
        let victorious = vitorias[i].c;
        i = len;
        return victorious;
      }else if(teste1 && teste3 && check(vitorias[i].b)){
        let victorious = vitorias[i].b;
        i = len;
        return victorious;
      }else if(teste2 && teste3 && check(vitorias[i].a)){
        let victorious = vitorias[i].a;
        i = len;
        return victorious;
      }else{
        let victorious = undefined;
      }
    }
  }

  // Função para checar se o humano está prestes a vencer e define a jogada da máquina como uma jogada que interrompa essa vitória
  function lose(){
    let len = vitorias.length;

    for(i = 0; i < len; i++){
      let teste1 = tabuleiro.some(tabuleiro => tabuleiro.move == vitorias[i].a && tabuleiro.player == 'human');
      let teste2 = tabuleiro.some(tabuleiro => tabuleiro.move == vitorias[i].b && tabuleiro.player == 'human');
      let teste3 = tabuleiro.some(tabuleiro => tabuleiro.move == vitorias[i].c && tabuleiro.player == 'human');

      if(teste1 && teste2 && check(vitorias[i].c)){
        let loser = vitorias[i].c;
        i = len;
        return loser;
      }else if(teste1 && teste3 && check(vitorias[i].b)){
        let loser = vitorias[i].b;
        i = len;
        return loser;
      }else if(teste2 && teste3 && check(vitorias[i].a)){
        let loser = vitorias[i].a;
        i = len;
        return loser;
      }else{
        let loser = undefined;
      }
    }
  }

  let venceu = victory();
  let perdeu = lose(); 

  if(venceu != undefined){
    return venceu;
  }else if(perdeu != undefined){
    return perdeu
  }else{
    // Caso ninguém esteja com uma jogada montada, ele escolhe uma posição aleatória do tabuleiro para jogar
    let max = possiveis.length;
    let myMove = Math.floor(Math.random() * max);
    return possiveis[myMove];
  }
}

function resetGame(){
  window.tabuleiro = [];
  window.possiveis = ['1x1', '1x2', '1x3', '2x1', '2x2', '2x3', '3x1', '3x2', '3x3'];
  //wipe board
  var list = document.getElementsByClassName('marker');
  for(i=0; i < list.length; i++){
    list[i].innerHTML = "";
    list[i].style.backgroundColor = "white";
  }
  document.getElementById('waitBox').style.display = 'none';
}
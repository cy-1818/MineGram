var width = 11
var height = 11
var easily = 0.4
var board = []
var vhint = []
var hhint = []
var vflag = false
var hflag = []
var table = document.getElementById("table")
var buttons = document.getElementById("buttons")
var helpNode = document.getElementById("help")
var open = true
var end = false
var openNum
var helpFlag = false
var startTime

function start(){
  startTime = Date.now()
  buttons.innerHTML = ""
  addSwitchButton()
  var endButton = document.createElement('span')
  endButton.innerText = "end"
  endButton.style.backgroundColor = "#f00"
  endButton.onclick = function(){
    gameOver()
    makeTable()
  }
  buttons.append(endButton)
  addHelpButton()
  board = []
  vhint = []
  hhint = []
  vflag = false
  hflag = []
  openNum = 0
  end = false
  for(var n=0;n<width;n++){
    hflag.push(false)
    hhint.push([])
  }
  for(var n=0;n<height;n++){
    board.push([])
    vhint.push([])
    vflag = false
    for(var m=0;m<width;m++){
      if(Math.random()>easily){
        board[n].push("n")
        openNum+=1
        if(vflag){
          vhint[n][vhint[n].length-1]+=1
        }else{
          vhint[n].push(1)
          vflag = true
        }
        if(hflag[m]){
          hhint[m][hhint[m].length-1]+=1
        }else{
          hhint[m].push(1)
          hflag[m] = true
        }
      }else{
        board[n].push("b")
        vflag = false
        hflag[m] = false
      }
    }
  }
  makeTable()
}

function makeTR(){
  var tr = document.createElement('tr')
  table.append(tr);
  return tr
}

function makeTable(){
  table.innerHTML = ""
  var hhintTR = makeTR()
  var spaceTH = document.createElement('th')
  hhintTR.append(spaceTH)
  for(var n=0;n<width;n++){
    var hintTH = document.createElement('th')
    hintTH.style.width = "1em"
    if(n%2===0 || end){
      hintTH.innerText = hhint[n].join(" ")
    }else{
      hintTH.innerText = "?"
    }
    hhintTR.append(hintTH)
  }
  for(var n=0;n<height;n++){
    var hTR = makeTR()
    var vhintTH = document.createElement('th')
    vhintTH.height = "1em"
    if(n%2===0 || end){
      vhintTH.innerText = vhint[n].join(" ")
    }else{
      vhintTH.innerText = "?"
    }
    hTR.append(vhintTH)
    for(var m=0;m<width;m++){
      var vTH = document.createElement('th')
      if(board[n][m] == "n"){
        vTH.onclick = (function(j,k){
          return (function(){
            if(open){
              openNum-=1
              if(openNum === 0){
                clear()
              }
              if((j+k)%2===0){
                board[j][k] = "o"
              }else{
                var num = 0
                num+=isBomb(j-1, k-1)
                num+=isBomb(j-1, k)
                num+=isBomb(j-1, k+1)
                num+=isBomb(j, k-1)
                num+=isBomb(j, k+1)
                num+=isBomb(j+1, k-1)
                num+=isBomb(j+1, k)
                num+=isBomb(j+1, k+1)
                board[j][k] = num
              }
            }else{
              board[j][k] = "p"
            }
            makeTable()
          })
        })(n,m)
        vTH.bgColor = "#ccc"
      }else if(board[n][m] == "b"){
        vTH.onclick = (function(j,k){
          return (function(){
            if(open){
              gameOver()
            }else{
              board[j][k] = "c"
            }
            makeTable()
          })
        })(n,m)
        vTH.bgColor = "#ccc"
        if(end){
          vTH.innerText = "b"
        }
      }else if(board[n][m] == "p"){
        vTH.onclick = (function(j,k){
          return (function(){
            if(!open){
              board[j][k] = "n"
              makeTable()
            }
          })
        })(n,m)
        vTH.bgColor = "#fcc"
      }else if(board[n][m] == "c"){
        vTH.onclick = (function(j,k){
          return (function(){
            if(!open){
              board[j][k] = "b"
              makeTable()
            }
          })
        })(n,m)
        vTH.bgColor = "#fcc"
        if(end){
          vTH.innerText = "b"
        }
      }else if(board[n][m] == "o"){
        vTH.innerText = "?"
        vTH.style.color = "#ccc"
        vTH.bgColor = "#fff"
      }else{
        vTH.innerText = board[n][m]
        vTH.style.color = "#999"
        vTH.bgColor = "#fff"
      }
      hTR.append(vTH)
    }
  }
}

function gameOver(){
  end = true
  alert("game over")
  setup()
}

function clear(){
  end = true
  clearTime = (Date.now()-startTime)/1000
  alert("game clear!!\nclear time : "+Math.floor(clearTime/60)+"m "+Math.floor(clearTime%60)+"s")
  setup()
}

function isBomb(n, m){
  if(n>=0&&n<width&&m>=0&&m<height&& (board[n][m]=="b" || board[n][m]=="c")){
    return 1
  }else{
    return 0
  }
}

function addSwitchButton(){
  buttons.append(document.createTextNode("tap : "))
  var switchButton = document.createElement('span')
  switchButton.innerText = "open"
  switchButton.style.backgroundColor = "#40e0ff"
  switchButton.style.margin = "3px"
  switchButton.style.width = "5em"
  switchButton.style.display = "inline-block"
  switchButton.style.textAlign = "center"
  switchButton.onclick = () => {
    if(open){
      open = false
      switchButton.style.backgroundColor = "#ffcccc"
      switchButton.innerText = "flag"
    }else{
      open = true
      switchButton.style.backgroundColor = "#40e0ff"
      switchButton.innerText = "open"
    }
  }
  buttons.append(switchButton)
}

function addHelpButton(){
  var helpButton = document.createElement('span')
  helpButton.innerText = "help"
  helpButton.style.backgroundColor = "#cfc"
  helpButton.style.margin = "3px"
  helpButton.onclick = function(){
    if(helpFlag){
      helpNode.innerHTML = ""
      helpFlag = false
    }else{
      helpNode.innerHTML = `
MineGram is a game created by mixing Minesweeper and Nonogram.<br/>
Nonogram numbers are pointing <strong>not</strong> bomb squares.<br/>
マインロジックはマインスイーパとお絵かきロジックを足して2で割ったものです。<br/>
なお、お絵かきロジックの数字はボムでないマスを指しているのでご注意ください。
`
      helpFlag = true
    }
  }
  buttons.append(helpButton)
}

function setup(){
  buttons.innerHTML = ""
  addSwitchButton()
  buttons.append(document.createTextNode("width : "))
  var txtw = document.createElement('span')
  txtw.style.width = "3em"
  txtw.innerText = width;
  txtw.contentEditable = true
  txtw.style.backgroundColor = "#ffc"
  buttons.append(txtw)
  buttons.append(document.createTextNode("height : "))
  var txth = document.createElement('span')
  txth.style.width = "3em"
  txth.contentEditable = true
  txth.style.backgroundColor = "#ffc"
  txth.innerText = height;
  buttons.append(txth)
  buttons.append(document.createTextNode("bomb probability : "))
  var slide = document.createElement('input')
  slide.type = "range"
  slide.min = 0
  slide.max = 1
  slide.step = 0.01
  slide.value = easily
  buttons.append(slide)
  var startButton = document.createElement('span')
  startButton.innerText = "start"
  startButton.style.backgroundColor = "#00f"
  startButton.style.color = "#fff"
  startButton.onclick = function(){
    width = Number(txtw.innerText)
    height = Number(txth.innerText)
    easily = Number(slide.value)
    start()
  }
  buttons.append(startButton)
  addHelpButton()
}

setup()
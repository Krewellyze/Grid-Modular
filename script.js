let corAtual = "#00ff00"
let modo = "pintar"
let isDrawing = false

const grid = document.getElementById("grid")
const reguaTop = document.getElementById("regua-top")
const reguaLeft = document.getElementById("regua-left")
const info = document.getElementById("info")

function setCor(cor) {
  corAtual = cor
  modo = "pintar"
}

function setModo(m) {
  modo = m
}

function gerarGrid() {
  const larguraInput = document.getElementById("largura")
  const comprimentoInput = document.getElementById("comprimento")

  const largura = parseFloat(larguraInput.value)
  const comprimento = parseFloat(comprimentoInput.value)

  if (!largura || !comprimento) {
    alert("Preencha as dimensões!")
    return
  }

  const cols = Math.round(largura / 0.3)
  const rows = Math.round(comprimento / 0.3)

  grid.innerHTML = ""
  reguaTop.innerHTML = ""
  reguaLeft.innerHTML = ""

  grid.style.gridTemplateColumns = `repeat(${cols}, 30px)`
  reguaTop.style.display = "grid"
  reguaTop.style.gridTemplateColumns = `repeat(${cols}, 30px)`

  reguaLeft.style.display = "grid"
  reguaLeft.style.gridTemplateRows = `repeat(${rows}, 30px)`

  // régua topo
  for (let i = 0; i < cols; i++) {
    let div = document.createElement("div")
    div.className = "regua-cell"
    div.innerText = (i * 0.3).toFixed(1)
    reguaTop.appendChild(div)
  }

  // régua lateral
  for (let i = 0; i < rows; i++) {
    let div = document.createElement("div")
    div.className = "regua-cell"
    div.innerText = (i * 0.3).toFixed(1)
    reguaLeft.appendChild(div)
  }

  // grid
  for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement("div")
    cell.className = "cell"

    cell.onmousedown = () => {
      isDrawing = true
      pintar(cell)
    }

    cell.onmouseover = () => {
      if (isDrawing) pintar(cell)
    }

    cell.ontouchstart = () => pintar(cell)

    grid.appendChild(cell)
  }

  document.body.onmouseup = () => isDrawing = false

  atualizarInfo()
}

function pintar(cell) {
  if (modo === "borracha") {
    cell.style.background = "white"
  } else {
    cell.style.background = corAtual
  }
  atualizarInfo()
}

function atualizarInfo() {
  const cells = document.querySelectorAll(".cell")

  let total = cells.length
  let cores = {}

  cells.forEach(c => {
    let cor = c.style.background || "white"
    cores[cor] = (cores[cor] || 0) + 1
  })

  let area = total * 0.09

  info.innerHTML = `
    Área: ${area.toFixed(2)} m² <br>
    Peças: ${total} <br>
    ${Object.entries(cores).map(([c,v]) => `${c}: ${v}`).join("<br>")}
  `
}

function limpar() {
  document.querySelectorAll(".cell").forEach(c => c.style.background = "white")
  atualizarInfo()
}

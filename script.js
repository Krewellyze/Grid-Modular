let corAtual = "#00aa00"
let modo = "pintar"
let isDrawing = false
let updateTimeout = null

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
  const largura = parseFloat(document.getElementById("largura").value)
  const comprimento = parseFloat(document.getElementById("comprimento").value)

  const cols = Math.round(largura / 0.3)
  const rows = Math.round(comprimento / 0.3)

  grid.innerHTML = ""
  reguaTop.innerHTML = ""
  reguaLeft.innerHTML = ""

  grid.style.gridTemplateColumns = `repeat(${cols}, 28px)`
  reguaTop.style.gridTemplateColumns = `repeat(${cols}, 28px)`
  reguaLeft.style.gridTemplateRows = `repeat(${rows}, 28px)`

  for (let i = 0; i < cols; i++) {
    let d = document.createElement("div")
    d.className = "regua-cell"
    d.innerText = (i * 0.3).toFixed(1)
    reguaTop.appendChild(d)
  }

  for (let i = 0; i < rows; i++) {
    let d = document.createElement("div")
    d.className = "regua-cell"
    d.innerText = (i * 0.3).toFixed(1)
    reguaLeft.appendChild(d)
  }

  const fragment = document.createDocumentFragment()

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

    fragment.appendChild(cell)
  }

  grid.appendChild(fragment)

  document.body.onmouseup = () => isDrawing = false

  atualizarInfo()
}

/* PERFORMANCE MELHORADA */
function pintar(cell) {
  if (modo === "borracha") {
    cell.style.background = "white"
  } else {
    cell.style.background = corAtual
  }

  if (!updateTimeout) {
    updateTimeout = setTimeout(() => {
      atualizarInfo()
      updateTimeout = null
    }, 100)
  }
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
    Área: ${area.toFixed(2)} m² | Peças: ${total}
  `
}

function limpar() {
  document.querySelectorAll(".cell").forEach(c => c.style.background = "white")
  atualizarInfo()
}

/* MODELOS */

function modeloXadrez() {
  const cells = document.querySelectorAll(".cell")
  const cols = Math.sqrt(cells.length)

  cells.forEach((c, i) => {
    let row = Math.floor(i / cols)
    let col = i % cols
    c.style.background = (row + col) % 2 ? corAtual : "white"
  })

  atualizarInfo()
}

function modeloMoldura() {
  const cells = document.querySelectorAll(".cell")
  const cols = Math.sqrt(cells.length)

  cells.forEach((c, i) => {
    let row = Math.floor(i / cols)
    let col = i % cols

    if (row === 0 || col === 0 || row === cols-1 || col === cols-1) {
      c.style.background = corAtual
    }
  })

  atualizarInfo()
}

function modeloListras() {
  const cells = document.querySelectorAll(".cell")
  const cols = Math.sqrt(cells.length)

  cells.forEach((c, i) => {
    let col = i % cols
    c.style.background = col % 2 ? corAtual : "white"
  })

  atualizarInfo()
}

function rotacionar() {
  grid.style.transform = grid.style.transform ? "" : "rotate(90deg)"
}

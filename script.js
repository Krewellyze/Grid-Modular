let corAtual = "green"
let modo = "pintar"
let isDrawing = false
let rotacionado = false

const grid = document.getElementById("grid")
const reguaTop = document.getElementById("regua-top")
const reguaLeft = document.getElementById("regua-left")

function setCor(cor) {
  corAtual = cor
  modo = "pintar"
}

function setModo(m) {
  modo = m
}

function gerarGrid() {
  const largura = parseFloat(larguraInput.value)
  const comprimento = parseFloat(comprimentoInput.value)

  const cols = Math.round(largura / 0.3)
  const rows = Math.round(comprimento / 0.3)

  grid.innerHTML = ""
  reguaTop.innerHTML = ""
  reguaLeft.innerHTML = ""

  grid.style.gridTemplateColumns = `repeat(${cols}, 30px)`
  reguaTop.style.gridTemplateColumns = `repeat(${cols}, 30px)`
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

  for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement("div")
    cell.className = "cell"

    // clique
    cell.onclick = () => pintar(cell)

    // arrastar (desktop)
    cell.onmouseover = () => {
      if (isDrawing) pintar(cell)
    }

    // mobile touch
    cell.ontouchstart = () => {
      isDrawing = true
      pintar(cell)
    }

    cell.ontouchmove = (e) => {
      const touch = document.elementFromPoint(
        e.touches[0].clientX,
        e.touches[0].clientY
      )
      if (touch && touch.classList.contains("cell")) {
        pintar(touch)
      }
    }

    grid.appendChild(cell)
  }

  document.body.onmousedown = () => isDrawing = true
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

function salvarImagem() {
  html2canvas(document.querySelector(".container")).then(canvas => {
    const link = document.createElement("a")
    link.download = "piso.png"
    link.href = canvas.toDataURL()
    link.click()
  })
}

function compartilhar() {
  html2canvas(document.querySelector(".container")).then(canvas => {
    canvas.toBlob(blob => {
      const file = new File([blob], "piso.png", { type: "image/png" })
      if (navigator.share) {
        navigator.share({ files: [file], title: "Projeto Piso" })
      } else {
        alert("Não suportado")
      }
    })
  })
}

function salvarProjeto() {
  const cells = [...document.querySelectorAll(".cell")].map(c => c.style.background || "white")
  localStorage.setItem("piso", JSON.stringify(cells))
  alert("Projeto salvo")
}

/* MODELOS */

function modeloXadrez() {
  const cells = document.querySelectorAll(".cell")
  const cols = Math.sqrt(cells.length)

  cells.forEach((c, i) => {
    let row = Math.floor(i / cols)
    let col = i % cols
    c.style.background = (row + col) % 2 === 0 ? "white" : "green"
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
      c.style.background = "pink"
    } else if (row === 1 || col === 1 || row === cols-2 || col === cols-2) {
      c.style.background = "white"
    } else {
      c.style.background = "green"
    }
  })

  atualizarInfo()
}

function modeloListras() {
  const cells = document.querySelectorAll(".cell")
  const cols = Math.sqrt(cells.length)

  cells.forEach((c, i) => {
    let col = i % cols
    c.style.background = col % 2 === 0 ? "green" : "white"
  })

  atualizarInfo()
}

/* ROTAÇÃO */

function rotacionar() {
  rotacionado = !rotacionado
  grid.style.transform = rotacionado ? "rotate(90deg)" : "rotate(0deg)"
}

let pagina = 1
let quantidadeDePaginas
let count
let statusPersonagem = ''
let morto
let desconhecido
let botaoPagina
let result = []

const cartoesPersonagens = document.getElementById("cards-personagens")
const containerPersonagens = document.getElementById("personagens")
const containerbotoes = document.getElementById("botoes-pagina")

async function carregarPersonagens() {
    try {
        carregarLocalizacao()
        carregarEpisodios()

        const response = await api.get(`/character?page=${pagina}`)
        const personagens = response.data.results
        console.log(response)

        quantidadeDePaginas = response.data.info.pages

        limparElemento(cartoesPersonagens)
        criarPaginacao(quantidadeDePaginas)

        personagens.forEach((personagem) => {
            const cardElement = criarCartao(personagem)
            cartoesPersonagens.appendChild(cardElement)
        })

        totalPersonagens(response.data.info.count)

    } catch (error) {
        console.log(error)
    }
}

function incrementarPagina() {
    if (pagina !== quantidadeDePaginas) {
        pagina++
        containerbotoes.innerHTML = ''
        carregarPersonagens()
        telaSuperior()
    }
}

function outra(quantidadeDePaginas) {
    pagina = pagina - 2
    criarPaginacao(quantidadeDePaginas)
    carregarPersonagens()
}

function decrementarPagina(quantidadeDePaginas) {
    if (pagina > 1) {
        pagina--
        containerbotoes.innerHTML = ''
        criarPaginacao(quantidadeDePaginas)
        carregarPersonagens()
        telaSuperior()
    }
}

function botaoPosterior() {
    if (pagina == 1) {
        pagina = 3
    } else if (pagina >= 3) {
        pagina++
    } else {
        pagina = 3
    }
    carregarPersonagens()
    telaSuperior()
}


function telaSuperior() {

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

async function carregarOsPersonagens() {
    await carregarPersonagens()
}

function criarPaginacao(quantidadeDePaginas) {
    console.log(pagina)
    containerbotoes.innerHTML = ''

    const navElemento = document.createElement("nav")
    navElemento.setAttribute("aria-label", "Page navigation example")

    const ulElemento = document.createElement("ul")
    ulElemento.className = "botao-paginacao"

    const liElementoAnterior = document.createElement("li")
    liElementoAnterior.className = "page-item"
    const aElementoAnterior = document.createElement("button")
    aElementoAnterior.addEventListener('click', () => {
        decrementarPagina(quantidadeDePaginas)
    })
    aElementoAnterior.className = "page-link"
    aElementoAnterior.innerHTML = "Anterior"
    liElementoAnterior.appendChild(aElementoAnterior)
    ulElemento.appendChild(liElementoAnterior)

    const liElemento1 = document.createElement("li")
    liElemento1.className = "page-item active"
    const aElemento1 = document.createElement("button")
    aElemento1.addEventListener('click', () => {
        if (pagina === quantidadeDePaginas) {
            outra(quantidadeDePaginas)
            return
        }
        decrementarPagina(quantidadeDePaginas)
    })
    aElemento1.className = "page-link"
    if (pagina > 1) {
        aElemento1.innerHTML = pagina - 1
    } else {
        aElemento1.innerHTML = 1
        liElementoAnterior.className = "disabled"
    }

    liElemento1.appendChild(aElemento1)
    ulElemento.appendChild(liElemento1)

    const liElemento2 = document.createElement("li")
    liElemento2.className = "page-item"
    const aElemento2 = document.createElement("button")
    aElemento2.addEventListener('click', () => {
        if (pagina === 1) {
            incrementarPagina()
        }
        if (pagina === quantidadeDePaginas) {
            decrementarPagina()
        }
    })
    aElemento2.className = "page-link"
    if (pagina > 1) {
        aElemento2.innerHTML = pagina
        liElemento2.className = 'active'
        liElemento1.classList.remove('active')
    } else {
        aElemento2.innerHTML = 2
    }

    liElemento2.appendChild(aElemento2)
    ulElemento.appendChild(liElemento2)

    const liElemento3 = document.createElement("li")
    liElemento3.className = "page-item"
    const aElemento3 = document.createElement("button")
    aElemento3.addEventListener('click', () => {
        botaoPosterior()
    })
    aElemento3.className = "page-link"
    if (pagina > 1) {
        aElemento3.innerHTML = pagina + 1
    } else {
        aElemento3.innerHTML = 3
    }
    if (pagina === quantidadeDePaginas) {
        aElemento3.innerHTML = quantidadeDePaginas
        aElemento2.innerHTML = quantidadeDePaginas - 1
        aElemento1.innerHTML = quantidadeDePaginas - 2
        liElemento3.className = 'active'
        liElemento2.classList.remove('active')
    }
    liElemento3.appendChild(aElemento3)
    ulElemento.appendChild(liElemento3)

    const liProximoElemento = document.createElement("li")
    liProximoElemento.className = "page-item"
    const aProximoElemento = document.createElement("button")
    aProximoElemento.addEventListener('click', () => {
        incrementarPagina()
    })

    if (pagina === quantidadeDePaginas) {
        liProximoElemento.className = "disabled"
    }
    aProximoElemento.className = "page-link"
    aProximoElemento.innerHTML = "Próxima"
    liProximoElemento.appendChild(aProximoElemento)
    ulElemento.appendChild(liProximoElemento)

    navElemento.appendChild(ulElemento)
    containerbotoes.appendChild(navElemento)
}

function criarCartao(personagem) {

    const colElemento = document.createElement('div')
    colElemento.className = 'col-12 col-md-6 col-lg-4 my-3 d-flex justify-content-center'


    const cardElement = document.createElement('div')
    cardElement.className = `tamanho-card puff-in-center bg-secondary text-white card my-2 mx-2 ${sombraStatusCard(personagem.status)}`
    const imageElement = document.createElement('img')
    imageElement.src = personagem.image
    imageElement.className = 'card-img-top imagem-personagem'
    imageElement.alt = 'Imagem do personagem'

    const cardBodyElement = document.createElement('div')
    cardBodyElement.className = 'card-body background border border-top-0 border-success rounded-bottom'

    const titleElement = document.createElement('h6')
    titleElement.className = 'card-title fs-5'
    titleElement.textContent = personagem.name

    const statusElement = document.createElement('p')
    statusElement.className = 'card-text fs-6'
    statusElement.innerHTML = iconeStatus(personagem.status)

    const statusPersonagemElement = document.createElement('span')
    statusPersonagemElement.className = 'fs-6 ms-3'
    statusPersonagemElement.innerHTML = `${personagem.status} - ${personagem.species}`

    const buttonElement = document.createElement('button')
    buttonElement.type = 'button'
    buttonElement.addEventListener('click', () => { modalPersonagem(personagem) })
    buttonElement.id = 'botao-detalhes'
    buttonElement.className = 'btn btn-padrao pulsate-fwd active'
    buttonElement.setAttribute('data-bs-toggle', 'modal')
    buttonElement.setAttribute('data-bs-target', '#modal-detalhes')
    buttonElement.style = '--bs-btn-padding-y: .25rem --bs-btn-padding-x: .5rem --bs-btn-font-size: .75rem'
    buttonElement.textContent = 'Mais detalhes'

    cardBodyElement.appendChild(titleElement)
    statusElement.appendChild(statusPersonagemElement)
    cardBodyElement.appendChild(statusElement)
    cardBodyElement.appendChild(buttonElement)

    cardElement.appendChild(imageElement)
    cardElement.appendChild(cardBodyElement)

    colElemento.appendChild(cardElement)
    return colElemento

}

function limparElemento(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild)
    }
}

function modalPersonagem(personagem) {
    const mostraModalDetalhes = document.getElementById('detalhes')
    const statusPersonagem = iconeStatus(personagem.status)

    const modalContent = `
        <div class="row">
            <div class="col-6 col-md-5">
                <img src="${personagem.image}" class="img-fluid rounded-start" alt="Imagem do personagem">
            </div>
            <div class="col-6 col-md-7 bg-dark-subtle">
                <div class="card-body">
                    <h4 class="card-title ">${personagem.name}</h4>
                    <p class="card-text">${statusPersonagem}<span class="ms-3">${personagem.status}</span> - ${personagem.species}</p>
                    <h6 class="card-title mb-0 ms-3">Localização:</h6>
                    <p class="card-text ms-3">${personagem.location.name}</p>
                </div>
            </div>
        </div>
    `
    mostraModalDetalhes.innerHTML = modalContent
}

function totalPersonagens(quantidade) {
    const totalPersonagens = document.getElementById("personagens")
    totalPersonagens.className = 'text-light'
    totalPersonagens.innerHTML = ` ${quantidade} `

}

function iconeStatus(status) {
    switch (status) {
        case 'Alive':
            return '<span class="color_status_vivo"></span>'
        case 'unknown':
            return '<span class="color_status_desconhecido"></span>'
        case 'Dead':
            return '<span class="color_status_morto"></span>'
        default:
            return ''
    }
}

function sombraStatusCard(status) {
    switch (status) {
        case 'Alive':
            return 'sombra_card_status_vivo'
        case 'unknown':
            return 'sombra_card_status_desconhecido'
        case 'Dead':
            return 'sombra_card_status_morto'
        default:
            return ''
    }
}

async function carregarEpisodios() {
    const episodioEl = document.getElementById("episodios")
    episodioEl.classList = 'text-light'

    try {
        const response = await api.get(`/episode`)
        episodioEl.innerHTML = ` ${response.data.info.count} `
    } catch (error) {
        console.log(error)
    }
}
async function carregarLocalizacao() {
    const localizacaoEl = document.getElementById("localizacoes")
    localizacaoEl.classList = 'text-light'

    try {
        const response = await api.get(`/location`)
        localizacaoEl.innerHTML = ` ${response.data.info.count} `
    } catch (error) {
        console.log(error)
    }
}

carregarOsPersonagens()
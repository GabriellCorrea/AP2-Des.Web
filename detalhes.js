const container = document.getElementById("atleta")
const body = document.querySelector("body")

const params = new URLSearchParams(window.location.search)
const id = parseInt(params.get("id"))

const pega_json = async (caminho) => {
    const resposta = await fetch(caminho);
    const dados = await resposta.json();
    return dados;
}

const montaDetalhes = (atleta) => {
    const pagina = document.createElement("div");
    pagina.classList.add("pagina");

    const foto = document.createElement("div");
    foto.classList.add("foto");
    const imagem = document.createElement("img");
    imagem.src = atleta.imagem;  
    foto.appendChild(imagem);

    const info = document.createElement("div");
    info.classList.add("info");

    const criaInfo = (titulo, conteudo) => {
        const item = document.createElement("h3");
        item.innerHTML = `<span class="info-title">${titulo}:</span> <span class="info-content">${conteudo}</span>`;
        info.appendChild(item);
    };
    

    criaInfo("Posição", atleta.posicao);
    criaInfo("Número de jogos", atleta.n_jogos);
    if (atleta.altura) criaInfo("Altura", atleta.altura);
    criaInfo("Joga no Botafogo desde", atleta.no_botafogo_desde);
    criaInfo("Data de nascimento", atleta.nascimento);
    criaInfo("Naturalidade", atleta.naturalidade);

    const desc = document.createElement("p");
    desc.innerHTML = atleta.detalhes;
    info.appendChild(desc);

    const nome = document.createElement("h1");
    nome.innerHTML = atleta.nome;
    container.appendChild(nome);

    const link = document.createElement("a");
    link.innerHTML = "Voltar";
    link.href = "index.html";
    body.appendChild(link);

    pagina.appendChild(foto);
    pagina.appendChild(info);
    container.appendChild(pagina);
};

if (sessionStorage.getItem("logado")) {
    pega_json(`https://botafogo-atletas.mange.li/2024-1/${id}`).then(
        (retorno) => {
            if (retorno && retorno.nome) {
                montaDetalhes(retorno);  
            } else {
                body.innerHTML = "<h1>Atleta não encontrado(a)!!!</h1>";
            }
        }
    )
} else {
    body.innerHTML = "<h1>Você precisa estar logado.</h1>";
}
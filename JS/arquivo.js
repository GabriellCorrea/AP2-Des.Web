import { hex_sha256 } from '../sha256.js';

const body = document.body;

const Header = () => {
    const banner = document.createElement('div');
    banner.className = 'banner-header';

    const titleH1 = document.createElement('h1');
    titleH1.textContent = 'Atletas Botafogo 2024-1';

    const logoutButton = botao_logout();
    banner.appendChild(titleH1);
    banner.appendChild(logoutButton);

    return banner;
};

const Login = () => {
    const caixa = document.createElement('div');
    caixa.className = 'login-caixa';

    const title = document.createElement('h4');
    title.textContent = 'Entre com a senha: GLORIOSO';

    const input = document.createElement('input');
    input.type = 'password';
    input.id = 'password';
    input.placeholder = 'Digite a senha';
    input.required = true;

    const botaoLogin = document.createElement('button');
    botaoLogin.textContent = 'Entrar';
    botaoLogin.addEventListener('click', manipulaLogin);

    caixa.appendChild(title);
    caixa.appendChild(input);
    caixa.appendChild(botaoLogin);

    return caixa;
};

async function manipulaLogin() {
    const senha = document.getElementById('password').value;
    const validarSenhaHash = hex_sha256('GLORIOSO');
    const senhaHash = hex_sha256(senha);

    if (senhaHash === validarSenhaHash) {
        sessionStorage.setItem('logado', 'sim');
        checkLoginStatus();
    } else {
        alert('Senha incorreta.');
    }
}

const botao_logout = () => {
    const BotaoLogout = document.createElement('button');
    BotaoLogout.id = 'logout';
    BotaoLogout.textContent = 'Logout';
    BotaoLogout.addEventListener('click', manipulaLogout);

    return BotaoLogout;
};

function manipulaLogout() {
    sessionStorage.removeItem('logado');
    checkLoginStatus();
}

const container = document.getElementById("container");

const pega_json = async (caminho) => {
    const resposta = await fetch(caminho);
    const dados = await resposta.json();
    return dados;
};

const manipulaClick = (e) => {
    const id = e.currentTarget.dataset.id;

    window.location = `detalhes.html?id=${id}`;
};

const montaCard = (atleta) => {
    const cartao = document.createElement("article");
    const nome = document.createElement("h1");
    const imagem = document.createElement("img");

    nome.innerHTML = atleta.nome;
    cartao.appendChild(nome);

    imagem.src = atleta.imagem;
    cartao.appendChild(imagem);

    cartao.dataset.id = atleta.id;

    cartao.onclick = manipulaClick;

    container.appendChild(cartao);
};

const criaFiltros = () => {
    const filtrosContainer = document.createElement("div");
    filtrosContainer.className = "filtros";

    const filtrarAtletas = (categoria) => {
        const urlMap = {
            Masculino: "https://botafogo-atletas.mange.li/2024-1/masculino",
            Feminino: "https://botafogo-atletas.mange.li/2024-1/feminino",
            "Elenco Completo": "https://botafogo-atletas.mange.li/2024-1/all"
        };
        
        if (urlMap[categoria]) {
            pega_json(urlMap[categoria]).then((retorno) => {
                atletas = retorno;
                exibirAtletas(retorno);
            });
        }
    };

    const isSmallScreen = window.innerWidth <= 768;
    
    if (isSmallScreen) {
        const selectFiltro = document.createElement("select");
        selectFiltro.onchange = (e) => filtrarAtletas(e.target.value);

        const optionNeutra = document.createElement("option");
        optionNeutra.value = "";
        optionNeutra.textContent = "Selecione um elenco";
        optionNeutra.disabled = true;
        optionNeutra.selected = true;
        selectFiltro.appendChild(optionNeutra);

        ["Masculino", "Feminino", "Elenco Completo"].forEach((categoria) => {
            const option = document.createElement("option");
            option.value = categoria;
            option.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
            selectFiltro.appendChild(option);
        });

        filtrosContainer.appendChild(selectFiltro);
    } else {
        ["Masculino", "Feminino", "Elenco Completo"].forEach((categoria) => {
            const button = document.createElement("button");
            button.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
            button.onclick = () => filtrarAtletas(categoria);
            filtrosContainer.appendChild(button);
        });
    }
    
    const buscaNome = document.createElement("input");
    buscaNome.type = "text";
    buscaNome.placeholder = "Buscar por nome";
    buscaNome.oninput = (e) => {
        const filtro = e.target.value.toLowerCase();
        const atletasFiltrados = atletas.filter((atleta) =>
            atleta.nome.toLowerCase().includes(filtro)
        );
        exibirAtletas(atletasFiltrados);
    };
    
    filtrosContainer.appendChild(buscaNome);
    body.insertBefore(filtrosContainer, container);
};

window.addEventListener("resize", () => {
    const filtrosContainer = document.querySelector('.filtros');
    if (filtrosContainer) {
        filtrosContainer.remove();
        criaFiltros();
    }
});

let atletas = [];

const exibirAtletas = (lista) => {
    container.innerHTML = "";
    lista.forEach((atleta) => montaCard(atleta));
};

const checkLoginStatus = () => {
    const logado = sessionStorage.getItem('logado');
    const header = document.querySelector('.banner-header');
    const filtros = document.querySelector('.filtros'); 
    const loginCaixa = document.querySelector('.login-caixa');
    const paragrafo = document.querySelector('p');

    if (logado === 'sim') {
        if (!header) body.insertBefore(Header(), body.firstChild);
        if (!filtros) criaFiltros();
        if (loginCaixa) body.removeChild(loginCaixa);
        if (paragrafo) body.removeChild(paragrafo);
    } 
    
    else {
        if (header) body.removeChild(header);
        if (filtros) filtros.remove();
        if (!loginCaixa) {
            const p = document.createElement('p');
            p.textContent = 'Conheça os atletas e seus detalhes do Botafogo 2024-1';
            body.appendChild(p);
            body.appendChild(Login());
        }
    }

    if (!logado) container.innerHTML = '';
};


checkLoginStatus();
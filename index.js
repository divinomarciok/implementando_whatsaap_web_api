
async function consultarchats() {

    const myHeaders = new Headers();
    myHeaders.append("x-api-key", "cursodev1");

    const formdata = new FormData();

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    try {
        const response = await fetch("http://localhost:3000/client/getChats/f8377d8d-a589-4242-9ba6-9486a04ef80c", requestOptions);
        const result = await response.json();
        return result; // Retorna o resultado para a função getChats
    } catch (error) {
        console.error(error);
        throw error; // Propaga o erro para ser tratado em getChats
    }
}


let chatsData; // Declarando a variável fora das funções

async function getChats() {
    try {
        chatsData = await consultarchats();
        console.log(JSON.stringify(chatsData, null, 2));

    } catch (error) {
        console.error("Erro ao obter chats:", error);
    }
}


async function consultaProduto(filtro) {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "filtro": filtro
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {

        const response = await fetch("http://localhost:4000/notifica/consulta", requestOptions);
        const result = await response.json();

        console.log(result)
        return result;

    } catch (error) {
        console.log(error)
    }
}

async function trataRetorno() {

    const id_naolidos = [];
    consultarchats().then(data => {

        const chats = data.chats; // Obtém o array de chats do JSON
        //console.log(chats)

        chats.forEach(chat => {
            if (chat.hasOwnProperty('unreadCount')) { // Verifica se o chat possui a propriedade unreadCount
                console.log(`${chat.name}: ${chat.unreadCount} mensagens não lidas id:${chat.id._serialized}`);
            } else {
                console.log(`${chat.name}: Não possui mensagens não lidas ou é um grupo desativado`);
            }
        });

    }).catch(error => {
        console.error("Erro ao buscar chats:", error);
    });

    return id_naolidos
}




async function trataretornoNew(filtro) {

    const id_naolidos = []
    try {

        const raw = await consultarchats(filtro)
        const chats = raw.chats;

        chats.forEach(chat => {
            if (chat.hasOwnProperty('unreadCount')) {

                if (chat.unreadCount != 0) {
                    const atendimento_unreadCount = {
                        unreadCount: chat.unreadCount,
                        name: chat.name,
                        chatId: chat.id._serialized,
                        body: chat.lastMessage._data.body
                    }
                    id_naolidos.push(atendimento_unreadCount)
                } else {

                }
            };
        })
        console.log(JSON.stringify(id_naolidos[0], null, 2));
        console.log(id_naolidos.length)
        return id_naolidos;
    } catch (error) {
        console.log(error)
    }
}





async function trataRetornoProduto(filtro) {
    try {

        const raw = await consultaProduto(filtro)
        const dados = raw.json;
        const produtoSelecionado = [];


        for (let i = 0; i < dados.length; i++) {
            const objeto = dados[i];

            const idObjeto = objeto._id;
            const dataFim = objeto.dataFim;
            const dataInicio = objeto.dataInicio;
            const loja = objeto.loja;

            //console.log(`ID: ${idObjeto}, Data Início: ${dataInicio}, Loja: ${loja}`);

            // Iterando sobre os produtos dentro do objeto
            for (let j = 0; j < objeto.produtos.length; j++) {
                const produto = objeto.produtos[j];
                const nomeProduto = produto.nome;
                const marcaProduto = produto.marca;
                const precoProduto = produto.preco;

                if (marcaProduto == filtro) {
                    const objetoVariavel = {
                        OFERTA: "Oferta localizada",
                        Loja: objeto.loja,
                        Produto: produto.nome,
                        Marca: produto.marca,
                        Preço: precoProduto.replace(',', ':'),
                        DataInicio: objeto.dataFim,
                        DataFim: objeto.dataInicio,
                        _id: objeto._id
                    }
                    produtoSelecionado.push(objetoVariavel)
                }
                // console.log(`  - Produto: ${nomeProduto}, Marca: ${marcaProduto}, Preço: ${precoProduto}`);
            }
        }

        return produtoSelecionado;
    } catch (error) {
        console.log(error)
    }
}

async function responde(chatId, resposta) {

    const myHeaders = new Headers();
    myHeaders.append("x-api-key", "cursodev1");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "chatId": chatId,
        "contentType": "string",
        "content": resposta
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://localhost:3000/client/sendMessage/f8377d8d-a589-4242-9ba6-9486a04ef80c", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log("deu certo"))
        .catch((error) => console.error(error));

}




async function respondeNaolidos() {
    try {

        const naolidos = await trataretornoNew()


        if (naolidos != null) {

            naolidos.forEach(chat => {
                const idChat = chat.chatId;
                const body = chat.body;
                let arrayBody = body.split(",");

                // let resposta = arrayBody[1] + "\n" + arrayBody[0] + "\n" + arrayBody[2]

                console.log(body)

                trataRetornoProduto(body)
                    .then(result => {
                        console.log(result)

                        const retorno = JSON.stringify(result);
                        let retornoIdentado = identaRetorno(retorno)
                        console.log(retornoIdentado)
                        //responde("556492112609@c.us", retornoIdentado)

                        responde(idChat,retornoIdentado)

                        console.log("deu ruim")

                    })
                    .catch(error => {
                        console.error(error)
                    })

                //console.log(resposta);
                //responde(idChat, resposta);

            })
        }

    } catch (error) {

        console.log(error)
    }

}

function identaRetorno(retorno) {

    let identandoRetorno = retorno.replace(/,/g, '\n')
    identandoRetorno = identandoRetorno.replace(/}/g, '\n')
    identandoRetorno = identandoRetorno.replace(/{/g, '\n')
    identandoRetorno = identandoRetorno.replace(/]/g, '')
    identandoRetorno = identandoRetorno.replace(/\[/g, '')

    console.log(identandoRetorno);
    return identandoRetorno

}

//setInterval(trataretornoNew,6000)

setInterval(respondeNaolidos, 6000)

/*trataRetornoProduto("Dona Cota")
    .then(result => {
        const retorno = JSON.stringify(result);

        let retornoIdentado = identaRetorno(retorno)
        console.log(retornoIdentado)
        //responde("556492112609@c.us", retornoIdentado)
    })
    .catch(error => {
        console.error(error)
    })
*/

//retornoIdentado



//respondeNaolidos()

//getChats()




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

async function trataretornoNew() {

    try {

        const raw = await consultarchats()
        const chats = raw.chats;
        const id_naolidos = []

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

async function responde(chatId,resposta) {

    const myHeaders = new Headers();
    myHeaders.append("x-api-key", "cursodev1");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "chatId": chatId,
        "contentType": "string",
        "content":resposta
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
        //console.log(naolidos)
        
        if(naolidos != null){

        naolidos.forEach (chat =>{
            const idChat = chat.chatId;
            const body = chat.body;

            let arrayBody = body.split(",");

            console.log(arrayBody)
            
            responde(idChat,arrayBody[0]);
            
        })
    }
        //responde(" VINHO CAMPO LARGO TINTO SUAV\n\nprice: 9,99\nvolume: 1L\nunit: LITRO\nmarca: CAMPO LARGO")
    } catch (error) {

        console.log(error)
    }

}


//setInterval(trataretornoNew,6000)

setInterval(respondeNaolidos,6000)


//respondeNaolidos()

//getChats()


/*let receba = "abacaxi, coca-cola, carne, peixe";

let arrayItens = receba.split(",");

let  item1 = arrayItens[3];

console.log(arrayItens)*/
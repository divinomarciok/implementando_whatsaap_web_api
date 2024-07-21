
async function consultarchats(){

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
        //console.log(JSON.stringify(chatsData, null, 2)); 
        
    } catch (error) {
        console.error("Erro ao obter chats:", error);
    }
}


async function trataRetorno (){

    const id_naolidos = [];
    consultarchats().then(data => {
        const chats = data.chats; // Obtém o array de chats do JSON
        //console.log(chats)
       chats.forEach(chat => {
            if (chat.hasOwnProperty('unreadCount')) { // Verifica se o chat possui a propriedade unreadCount
                //console.log(`${chat.name}: ${chat.unreadCount} mensagens não lidas id:${chat.id._serialized}`);

                if(chat.unreadCount == 1){
                id_naolidos.push(chat.unreadCount,chat.name,chat.id._serialized)
                    console.log(id_naolidos)
                }
            } else {
               //console.log(`${chat.name}: Não possui mensagens não lidas ou é um grupo desativado`);
            }
        });
    }).catch(error => {
        console.error("Erro ao buscar chats:", error);
    });
    return id_naolidos
}

trataRetorno()
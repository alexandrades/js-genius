// Objeto para armazenamento do estado atual do jogo
// score : Pontuação alcançada pelo jogador
// numbers : vetor contendo a sequencia de numero que o jogador deve inserir
// user_input : vetor contendo todos os numeros selecionados pelo jogador durante a rodada
// tamanho : tamanho de ambos os vetores

var data = {
    score: 0,
    numbers: [],
    user_input: [],
    tamanho: 0
}

// Gera um número aleatório entre 1 e 9 inserindo-o na sequencia
const addRandomNumber = () => {
    let new_number = Math.floor(Math.random() * (9 - 1) + 1)
    data.numbers.push(new_number)
    data.tamanho = data.tamanho + 1
}

// Exibe os numeros da sequencia, um por vez a cada 300ms
const displayNumbers = () => {
    const number_display = document.getElementById('number')
    var index = 0
    
    var interval_id = setInterval(() => {
        // Se index = tamanho da sequencia indica que todos os números ja foram exibidos então,
        // chama função para comparar entrada do usuário e a sequencia
        if(index == data.numbers.length){
            number_display.innerText = ""
            verifyInput()
            clearInterval(interval_id)
            return
        }
        else{
            number_display.innerText = data.numbers[index]
            index++
        }
    }, 300);
}

// Insere no vetor de entradas do usuario
const addInput = (input) => {
    data.user_input.push(input)
}


// Percorre os elementos da DOM que fazem parte do "teclado" adicionando o evento click
// chamando a função addInput passando como argumento ser respectivo valor
const addKeyboardFunctions = () => {
    let item_button = document.getElementsByClassName("button-item")
    for(let x = 0; x < 9; x++){
        item_button[x].addEventListener("click", () => {
            addInput(x+1)
        })
    }
}

// Finaliza o jogo
const gameOver = () => {
    let form = document.createElement('form')
    var input_score = document.createElement('input')
    let body = document.getElementsByTagName('body')

    // Adiciona um formulario com um input type=hidden e valor correspondente ao score
    form.action = "/game-over"
    form.method = "POST"
    input_score.name = "score"
    input_score.value = data.score
    input_score.type = "hidden"
    form.appendChild(input_score)
    body[0].appendChild(form)
    // Realiza o envio do formulário prosseguindo para a Tela de Fim de jogo
    form.submit()
}

// Compara entradas do usuario com a sequencia do jogo
const verifyInput = () => {
    var numbers_qtd = data.numbers.length
    // Promisse para comparar o tamanho dos vetores com o estado fulfilled
    let promisse = new Promise((resolve, reject) => {
        let interval_id = setInterval(() => {
            if(data.user_input.length == numbers_qtd){
                clearInterval(interval_id)
                resolve()
            }
        }, 100);
    })

    // Compara cada elemento dos vetores,
    // Se houver um elemento divergente, chama o metodo gameOver() para finalizar
    promisse.then(() => {
        console.log("Quantidade: "+numbers_qtd)
        for(var x = 0; x < numbers_qtd; x++){
            if(data.numbers[x] == data.user_input[x]){
                console.log(data.numbers[x]+" == "+data.user_input[x])
                continue
            }
            else{
                gameOver()
            }
        }
        // Se não, incrementa o score, zera o tamanho e o vetor com entradas do usuario,
        // adiciona um número aleátorio a sequencia do jogo e exibe os números novamente reiniciando o ciclo
        data.score++
        data.tamanho = 0
        data.user_input = []
        addRandomNumber()
        displayNumbers()

    })
}


// Adiciona os eventos aos botões
addKeyboardFunctions()

// Adiciona o primeiro número à sequencia para inicio do jogo
addRandomNumber()

// Exibe a sequencia, dando inicio ao jogo
displayNumbers()


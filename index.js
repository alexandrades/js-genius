const handlebars = require('express-handlebars')
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const app = express()

// Config engine
    app.engine("handlebars", handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    // CSS, JavaScript e Imagens
    app.use('/images', express.static('images'))
    app.use('/css', express.static('css'))
    app.use('/scripts', express.static("scripts"))

    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

// Routes
    // Tela inicial contendo o menu
    app.get('/', (req, res) => {
        res.render("menu")
    })

    // Tela com interface do jogo
    app.get('/play', (req, res) => {
        res.render("game")
    })

    // Tela de Fim de jogo
    app.post('/game-over', (req, res) => {
        res.render("game_over", req.body)
    })

    // Tela de ranking
    app.get('/ranking', (req, res) => {
        // Requisição assincrona para obter o ranking
        axios.get('https://us-central1-prova-front-letras.cloudfunctions.net/ranking')
        .then(function(response){
            // Ordena os jogadores no ranking da maior pontuação para a menor
            response.data.sort((a, b) => {
                return b.score - a.score
            })
            res.render("ranking", {players : response.data})
        }).catch((error) => {
            // Mensagem de erro é impressa no console
            console.log(error)
        })

    })

    // Rota acessada para realizar a requisição para salvar pontuação no ranking e redirecionar para a tela com o ranking
    app.post('/save-ranking', (req, res) => {
        axios.post("https://us-central1-prova-front-letras.cloudfunctions.net/save", {name : req.body.name, score : parseInt(req.body.score)})
        .then((response) => {
            res.redirect("/ranking")
        })
        .catch((error) => {
            res.send("Erro: " + error)
        })
    })

// Inicialização do servidor no host "//localhost:8080"

app.listen(8080, () => {
    console.log("Servidor rodando.")
})
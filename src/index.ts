import express,{Request, Response} from "express";
import path from "path";
import { ReplOptions } from "repl";


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "/views"));

app.get('/', function (request:Request, response: Response) {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            response.render("index", data);
        });
});

app.get('/detalhar/:name', function (req: Request, res: Response) {
    const pokemonName = req.params.name;
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(response => response.json())
        .then(pokemonData => {
            const abilities = pokemonData.abilities.map((ability: any) => ability.ability.name).join(', ');
            const types = pokemonData.types.map((type: any) => type.type.name).join(', ');
            const height = pokemonData.height;
            const weight = pokemonData.weight;
            const stats = pokemonData.stats.map((stat: any) => `${stat.stat.name}: ${stat.base_stat}`).join(', ');
            const imageUrl = pokemonData.sprites.front_default;
        
            const responseText = `
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f0f0f0;
                            color: #333;
                            margin: 0;
                            padding: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                        }
                        .container {
                            background: #fff;
                            border-radius: 20px;
                            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                            padding: 30px;
                            max-width: 600px;
                            width: 100%;
                            display: flex;
                            flex-direction: column;
                            align-items: flex-start;
                            justify-content: flex-start;
                        }
                        h1 {
                            font-size: 2.5em;
                            margin-bottom: 20px;
                            color: #333;
                            text-transform: capitalize;
                        }
                        .pokemon-header {
                            display: flex;
                            flex-direction: row;
                            align-items: flex-start;
                            justify-content: space-between;
                            width: 100%;
                        }
                        img {
                            border-radius: 10px;
                            border: 4px solid #ddd;
                            max-width: 250px;
                            height: 250px;
                            object-fit: cover;
                            margin-right: 20px;
                        }
                        .info-container {
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-start;
                            text-align: left;
                            padding: 10px;
                        }
                        .info-container p {
                            margin: 5px 0;
                            font-size: 1.1em;
                            color: #555;
                        }
                        strong {
                            color: #222;
                        }

                        .stats-container {
                            margin-top: 20px;
                            text-align: left;
                            width: 100%;
                            background: #f8f8f8;
                            padding: 5px;
                            border-radius: 10px;
                        }

                        .stat-item {
                            display: flex;
                            justify-content: space-between;
                            padding: 8px 0;
                            font-size: 1.1em;
                            border-bottom: 1px solid #ddd;
                        }

                        .stat-name {
                            text-transform: capitalize;
                            font-weight: bold;
                            color: #444;
                        }

                        .stat-value {
                            color: #666;
                        }

                        body {
                            background-color: #eaeaea;
                            color: #333;
                        }

                        .container {
                            background-color: #f8f8f8;
                            color: #333;
                            border-radius: 20px;
                            padding: 25px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="pokemon-header">
                            <img 
                                src="${imageUrl}" 
                                alt="Imagem do Pokémon ${pokemonName}" 
                            />
                            <div class="info-container">
                                <h1>${pokemonName}</h1>
                                <p><strong>Tipos:</strong> ${types}</p>
                                <p><strong>Altura:</strong> ${height} m</p>
                                <p><strong>Peso:</strong> ${weight} kg</p>
                                <p><strong>Habilidades:</strong> ${abilities}</p>
                            </div>
                        </div>
        
                        <div class="stats-container">
                            <h2>Estatísticas</h2>
                            ${pokemonData.stats.map(stat => `
                                <div class="stat-item">
                                    <span class="stat-name">${stat.stat.name}</span>
                                    <span class="stat-value">${stat.base_stat}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </body>
                </html>
            `;

            res.send(responseText);

        })
        .catch(error => {
            res.status(500).send("Erro ao buscar dados do Pokémon.");
        });
});

app.listen(3000, function () {
    console.log("Server is running");
})
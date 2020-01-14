const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

//controller geralmente tem 5 funções principais
//index = mostrar uma lista desse recurso 
//show = mostrar apenas um unico recurso
//store = criar
//uptade = atualizar
//destroy = destroir

module.exports = {
    async index(request,response){
        const devs = await Dev.find();

        return response.json(devs);
    },

    

    async store(request,response){
        const { github_username, techs, latitude, longitude } = request.body;

        //vou no banco de dados e procuro se ja existe um github com esse nome cadastrado
        let dev = await Dev.findOne({ github_username});

        if(!dev){
            //Usando crase ao inves de ' ou " porque a crase me permite colocar variaveis dentro de strings
            //Isso se chama template strings
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
        
            const {name = login, avatar_url, bio} = apiResponse.data;
        
            //separando a string para virar um vetor de strings
            //e junto com isso removendo os espaços desnecessarios com o map() e tech.trim()
            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
        
            //usando short sintax, que é como o nome da propriedade é o mesmo nome da variavel nao precisamos usar dois pontos
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })
        }
    
        return response.json(dev);
    }
}
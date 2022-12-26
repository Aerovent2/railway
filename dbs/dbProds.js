import baseDeDatos from "./db.js";


import {faker} from '@faker-js/faker'
faker.locale = "es_MX"

const {commerce,image}= faker
let productos =[]
for(let i=0;i<5;i++){
   
productos.push( {title:commerce.product(), price:commerce.price(),thumbnail:image.technics()})
}

export default class dbProd extends baseDeDatos{
    constructor(){
        super(productos)
    }

}


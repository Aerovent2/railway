import {schema} from 'normalizr'

const messageSchema = new schema.Entity('mensajes')
const authorSchema= new schema.Entity('autores')

const mySchema = [
    {   
        'text':[messageSchema],
        "author":authorSchema,
    }
]

export default mySchema
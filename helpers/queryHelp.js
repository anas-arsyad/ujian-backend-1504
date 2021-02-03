const util = require('util')
const database = require('../database/')
module.exports={
    generateQuery:(body)=>{
        let result = ''
    for (let property in body) {
        // console.log(property)
        // console.log(typeof(property))
        if(property==="status"){
            result += ` ms.${property} = '${body[property]}' and`
            
        }else if(property==="location"){
            result += ` l.${property} = '${body[property].toLowerCase()}' and`
        }
        else if(property==="time"){
            result += ` st.${property} = '${body[property]}' and`
        }
        else{
            result += ` ${property} = '${body[property]}' and`
        }
        console.log(result)
    }
    return result.slice(0, -3)
    },
    asyncQuery: util.promisify(database.query).bind(database)
}
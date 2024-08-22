var Sequelize=require("sequelize");

var sequelize=new Sequelize("bdnz5pzyr7xnyyvwpkat", "uyypxsgdtztqstyv", "tINYin2HMrGe4b5uAaYi", {
  host:"bdnz5pzyr7xnyyvwpkat-mysql.services.clever-cloud.com",
  dialect: "mysql"
})

sequelize.authenticate().then(()=>{
  console.log("conectado com sucesso")
}).catch((erro)=>{
  console.log("erro: "+erro)
})

var crude=sequelize.define(
  "Crude",{
  Produto:{
    type:Sequelize.STRING
  },
  Valor:{
    type:Sequelize.DOUBLE
  },
  File: {
    type:Sequelize.TEXT
  }
})

crude.sync({force: true})

module.exports=crude;

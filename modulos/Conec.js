var Sequelize=require("sequelize");

var sequelize=new Sequelize("bdnz5pzyr7xnyyvwpkat", "uyypxsgdtztqstyv", "tINYin2HMrGe4b5uAaYi", {
  host:"bdnz5pzyr7xnyyvwpkat",
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

module.exports=crude;

//crude.sync({force: true})
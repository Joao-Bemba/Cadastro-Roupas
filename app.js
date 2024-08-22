var express=require('express');

var porta=process.env.PORT || 3000

var flash=require('connect-flash')

var session=require('express-session')

var fs=require('fs')

var crude=require("./modulos/Conec")

var fileupload=require("express-fileupload");

var handlebars=require('express-handlebars');

var app=express();




//config
app.engine("handlebars", handlebars.engine({
  defaulLayout: 'main',
  runtimeOptions:{
    allowProtoPropertiesByDefault:true,
    allowProtoMethodsByDefault:true
  }
}))


app.use(session({secret: '0518', resave:true, saveUninitialized:true}))


app.use(flash())

app.use((req,res,next)=>{
  res.locals.sucess_msg=req.flash('sucess_msg')
  
res.locals.error_msg=req.flash('error_msg')

next()

})

//para fazer o upload de ficheiro
app.use(fileupload())

app.set("view engine", "handlebars");

app.use(express.urlencoded({extended:false}))

app.use(express.json())

//referencia a pasta para ser usada no handlebars


app.use('/img', express.static('./img'))

app.use('/Css', express.static('./Css'))


app.get('/', (req, res)=>{
    res.render("conteudo/form")
})

app.get("/lista", (req, res)=>{
  crude.findAll().then((crudes)=>{
    res.render("conteudo/lista", {crudes:crudes})
  }).catch((erro)=>{
    res.send("Erro 404")
  })
})

app.post('/cad', (req, res)=>{
  
   var Produto=req.body.Produto
   
   var Valor=req.body.Valor
   
   var File=req.files.File.name
   
   crude.create({
     Produto:Produto,
     Valor:Valor,
     File:File
   }).then(()=>{
     //para mover para uma pasta
     req.files.File.mv(__dirname+"/img/"+req.files.File.name)
     req.flash('sucess_msg', 'criada com sucesso')
     res.redirect('/')
     
   }).catch((erro)=>{
     req.flash('error_msg', 'erro ao adicionar')
     res.redirect("/")
   })

  
})

app.get("/delete/:id/:File/",(req,res)=>{
  crude.destroy({where:{id:req.params.id}}).then(()=>{
    
    //para remover o arquivo
    fs.unlink(__dirname+"/img/"+req.params.File, (erro)=>{
      console.log("erro: "+erro)
    })
    req.flash('sucess_msg', 'Eliminada Com Sucesso')
    res.redirect('/')
  }).catch((erro)=>{
    req.flash('error_msg', 'erro ao eliminar')
    res.redirect('/')
  })
})

app.get('/Editar/:id', (req, res)=>{
  crude.findOne({where: {id: req.params.id}}).then((crude)=>{
    res.render("conteudo/Ed", {crude: crude})
  })
})

app.post("/Ed/:id", (req, res)=>{
  var NovoProduto=req.body.Produto
  
  var NovoValor=req.body.Valor
  
  var Img=req.body.novaImg
  
  var NovaImg=req.files.File.name
  
crude.update({
  
    Produto:NovoProduto,
    Valor:NovoValor,
    File:NovaImg
  },
  {
    where:{
    id: req.params.id
  }
    
  }).then(()=>{
    
    fs.unlink(__dirname+"/img/"+Img, (erro)=>{
      console.log('erro')
    })
    
  
    req.files.File.mv(__dirname+"/img/"+NovaImg)
    req.flash('sucess_msg', 'Editada Com Sucesso')
    res.redirect('/')
    
  }).catch((erro)=>{
    req.flash('error_msg', 'erro ao editar')
    res.redirect('/')
  })
  
})

app.get("/home",(req, res)=>{
  res.send("Editada com Sucesso")
})

app.listen(porta, ()=>{
  console.log("Servidor rodando")
});
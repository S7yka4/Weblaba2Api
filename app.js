const express = require("express");
const fs = require("fs");
    
const app = express();
const jsonParser = express.json();
  
app.use(express.static(__dirname + "/public"));
  
const filePath = "Chely.json";
app.get("/api/Chely", function(req, res){
       
    const content = fs.readFileSync(filePath,"utf8");
    const chely = JSON.parse(content);
    res.send(chely);
});


app.get("/api/Chely/:id", function(req, res){
       
    const id = req.params.id; // получаем id
    const content = fs.readFileSync(filePath, "utf8");
    const Chely = JSON.parse(content);
    let Chel = null;
    // находим в массиве пользователя по id
    for(var i=0; i<Chely.length; i++){
        if(Chely[i].id==id){
            Chel = Chely[i];
            break;
        }
    }
    // отправляем пользователя
    if(Chel){
        res.send(Chel);
    }
    else{
        res.status(404).send();
    }
});

// получение отправленных данных
app.post("/api/Chely", jsonParser, function (req, res) {
      
    if(!req.body) return res.sendStatus(400);
      
    const ChelName = req.body.name;
    const ChelDesc = req.body.description;
    let Chel = {name: ChelName, description: ChelDesc};//111
      
    let data = fs.readFileSync(filePath, "utf8");
    let chely = JSON.parse(data);
      
    // находим максимальный id
	let id= Math.max.apply(Math,chely.map(function(o){return o.id;}));

    // увеличиваем его на единицу
	if(id==-Infinity)
		id=0;
	Chel.id = id+1
	

	
	
    // добавляем пользователя в массив
	
    chely.push(Chel);
    data = JSON.stringify(chely);
    // перезаписываем файл с новыми данными
    fs.writeFileSync("Chely.json", data);
    res.send(Chel);
});

 
app.delete("/api/Chely/:id", function(req, res){
       
    const id = req.params.id;
    let data = fs.readFileSync(filePath, "utf8");
    let Chely = JSON.parse(data);
    let index = -1;
    // находим индекс пользователя в массиве
    for(var i=0; i < Chely.length; i++){
        if(Chely[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){
        // удаляем пользователя из массива по индексу
        const Chel = Chely.splice(index, 1)[0];
        data = JSON.stringify(Chely);
        fs.writeFileSync("Chely.json", data);
        // отправляем удаленного пользователя
        res.send(Chel);
    }
    else{
        res.status(404).send();
    }
});
 
app.put("/api/Chely", jsonParser, function(req, res){
       
    if(!req.body) return res.sendStatus(400);
      
    const ChelId = req.body.id;
    const ChelName = req.body.name;
    const ChelDesc = req.body.description;
      
    let data = fs.readFileSync(filePath, "utf8");
    const Chely = JSON.parse(data);
    let Chel;
    for(var i=0; i<Chely.length; i++){
        if(Chely[i].id==ChelId){
            Chel = Chely[i];
            break;
        }
    }
    // изменяем данные у пользователя
    if(Chel){
        Chel.description = ChelDesc;
        Chel.name = ChelName;
        data = JSON.stringify(Chely);
        fs.writeFileSync("Chely.json", data);
        res.send(Chel);
    }
    else{
        res.status(404).send(Chel);
    }
});
 
app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});
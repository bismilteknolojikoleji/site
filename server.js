const express = require("express")
const app = express()
const tarih = new Date().getFullYear()
const iletisim = new Date().toLocaleString()
const { db } = require("./src/backend/database")
const bp = require("body-parser")
const session = require('express-session')
const path = require('path')
const { token } = require("./src/backend/token")
const sifre = "Fsuat-F-S-U-A-T"
const { pass } = require("./src/backend/db/db.json")
app.use(session({
	secret: 'admin',
	resave: true,
	saveUninitialized: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(bp.urlencoded({ extended: false }))

app.use(bp.json())

app.use(express.static(process.cwd() + "/src/frontend/public"))

app.get("/", (req, res) => {
    res.render(process.cwd() + "/src/frontend/views/index.ejs", { tarih: tarih, session: req.session.password, blog: db.fetch("blog").sort((a, b) => b - a).slice(0, 3)})
})

app.get("/genclige-hitabe", (req, res) => {
    res.render(process.cwd() + "/src/frontend/views/genclige-hitabe.ejs", { tarih: tarih, session: req.session.password, hitabe: db.fetch("genclige-hitabe") })
})

app.get("/home", (req, res) => {
    res.render(process.cwd() + "/src/frontend/views/home.ejs", { tarih: tarih, session: req.session.password, blog: db.fetch("blog").sort((a, b) => b - a).slice(0, 4)})
})
app.get("/vizyonumuz-misyonumuz", (req, res) => {
    res.render(process.cwd() + "/src/frontend/views/vizyonumuz-misyonumuz.ejs", { tarih: tarih, session: req.session.password, vizyon: db.fetch("vizyon"), misyon: db.fetch("misyon") })
})

app.post("/onkayit", (req, res) => {
    if (data.success === true) {
      if(req.body.ogrenci && req.body.veli && req.body.iletisim1){
        db.push("onkayit", {
            "ogrenci": req.body.ogrenci,
            "veli": req.body.veli,
            "iletisim1": req.body.iletisim1,
            "iletisim2": req.body.iletisim2,
            "tarih": iletisim
        })
        res.redirect("/onkayit?başarılı")
    }else{
        res.redirect("/onkayit?hata")
    }
    } else {
      console.log('verification failed');
    }
})
app.get("/giris", (req, res) => {
    if(!req.session.password){
        res.render(process.cwd() + "/src/frontend/views/admin/giris.ejs")
    }else{
        res.redirect("/")
    }
})
app.post("/giris", (req, res) => {
	const password = req.body.password
    if(password){
        if(password == pass){
            req.session.password = pass
            req.session.save()
            res.redirect("/")
        }else{
            res.redirect("/giris?hata")
        }
    }else{
        res.redirect("/giris?hata")
    }
})

app.get("/admin/ogretmenler", (req, res) => {
    if(req.session.password){
        res.render(process.cwd() + "/src/frontend/views/admin/ogretmenler.ejs", { tarih: tarih, session: req.session.password, ogretmenler: db.fetch("ogretmenler") })
    }else{
        res.redirect("/")
    }
})

app.post("/admin/ogretmenler", (req, res) => {
    if(req.session.password){
        db.push("ogretmenler", {
            "isim": req.body.isim,
            "bolum": req.body.bolum,
            "img": req.body.img
        })
        res.redirect("/admin/ogretmenler")
    }else{
        res.redirect("/")
    }
})

app.get("/admin/blog", (req, res) => {
    if(req.session.password){
        res.render(process.cwd() + "/src/frontend/views/admin/blog.ejs", { blog: db.fetch("blog"), tarih: tarih, session: req.session.password })
    }else{
        res.redirect("/")
    }
})

app.get("/admin/onkayit", (req, res) => {
    if(req.session.password){
        res.render(process.cwd() + "/src/frontend/views/admin/onkayit.ejs", { onkayit: db.fetch("onkayit"), tarih: tarih, session: req.session.password })
    }else{
        res.redirect("/")
    }
})

app.get("/admin/vizyon-misyon", (req, res) => {
    if(req.session.password){
        res.render(process.cwd() + "/src/frontend/views/admin/vizyon-misyon.ejs", { vizyon: db.fetch("vizyon"), misyon: db.fetch("misyon"), tarih: tarih, session: req.session.password })
    }else{
        res.redirect("/")
    }
})

app.get("/admin/genclige-hitabe", (req, res) => {
    if(req.session.password){
        res.render(process.cwd() + "/src/frontend/views/admin/genclige-hitabe.ejs", { hitabe: db.fetch("genclige-hitabe"), tarih: tarih, session: req.session.password })
    }else{
        res.redirect("/")
    }
})

app.get("/admin/bolumlerimiz", (req, res) => {
    if(req.session.password){
        res.render(process.cwd() + "/src/frontend/views/admin/bolumlerimiz.ejs", { bolumler: db.fetch("bolumlerimiz"), tarih: tarih, session: req.session.password })
    }else{
        res.redirect("/")
    }
})
app.get("/admin/idare", (req, res) => {
    if(req.session.password){
        res.render(process.cwd() + "/src/frontend/views/admin/idare.ejs", { idare: db.fetch("idare"), tarih: tarih, session: req.session.password })
    }else{
        res.redirect("/")
    }
})
app.get("/cikis", (req, res) => {
    req.session.destroy()
    res.redirect("/")
})

app.post("/admin/blog", (req, res) => {
    if(req.session.password){
        if(db.fetch("blog").date){
            db.push("blog", {
                "id":  Math.random().toString(35).substr(2) +  Math.random().toString(35).substr(2),
                "title": req.body.title,
                "description": req.body.description,
                "blog": req.body.editor1,
                "date": db.fetch("blog").date + 1
            })
        }else{
            db.push("blog", {
                "id":  Math.random().toString(35).substr(2) +  Math.random().toString(35).substr(2),
                "title": req.body.title,
                "description": req.body.description,
                "blog": req.body.editor1,
                "date": Date.now()
            })
        }
        res.redirect("/admin/blog")
    }
})

app.post("/admin/idare", (req, res) => {
    if(req.session.password){
        db.push("idare", {
            "isim": req.body.isim,
            "statu": req.body.statu,
            "img": req.body.img
        })
        res.redirect("/admin/idare")
    }
})

app.post("/admin/bolumlerimiz", (req, res) => {
    if(req.session.password){
        db.push("bolumlerimiz", {
            "isim": req.body.isim,
            "category": req.body.category,
            "img": req.body.img
        })
        res.redirect("/admin/bolumlerimiz")
    }
})

app.post("/admin/vizyon", (req, res) => {
    if(req.session.password){
        db.set("vizyon", [{
            "vizyon": req.body.editor1
        }])
        res.redirect("/admin/vizyon-misyon")
    }
})

app.post("/admin/genclige-hitabe", (req, res) => {
    if(req.session.password){
        db.set("genclige-hitabe", [{
            "hitabe": req.body.editor1
        }])
        res.redirect("/admin/genclige-hitabe")
    }
})

app.post("/admin/misyon", (req, res) => {
    if(req.session.password){
        db.set("misyon", [{
            "misyon": req.body.editor2
        }])
        res.redirect("/admin/vizyon-misyon")
    }
})

app.get("/ogretmenlerimiz", (req, res) => {
    res.render(process.cwd() + "/src/frontend/views/ogretmenlerimiz.ejs", { ogretmenler: db.fetch("ogretmenler"), tarih: tarih, session: req.session.password })
})
app.get("/idare", (req, res) => {
    res.render(process.cwd() + "/src/frontend/views/idare.ejs", { idare: db.fetch("idare"), tarih: tarih, session: req.session.password })
})
app.get("/sil/ogretmen/:isim", (req , res) => {
    if(req.session.password){
        const datass = db.fetch("ogretmenler")

        for(let i = 0; i < datass.length; i++){
            if(datass[i].isim === req.params.isim){
                delete datass[i]
                delete null
                db.set("ogretmenler", datass.filter(function (el) {
                    return el != null;
                  }))
                  res.redirect("/admin/ogretmenler")
            }
        }
    }else{
        res.redirect("/")
    }
})

app.get("/sil/blog/:id", (req , res) => {
    if(req.session.password){
        const datass = db.fetch("blog")

        for(let i = 0; i < datass.length; i++){
            if(datass[i].id === req.params.id){
                delete datass[i]
                delete null
                db.set("blog", datass.filter(function (el) {
                    return el != null;
                }))
                res.redirect("/admin/blog")
            }
        }
    }else{
        res.redirect("/")
    }
})

app.get("/sil/bolumlerimiz/:isim", (req , res) => {
    if(req.session.password){
        const datass = db.fetch("bolumlerimiz")

        for(let i = 0; i < datass.length; i++){
            if(datass[i].isim === req.params.isim){
                delete datass[i]
                delete null
                db.set("bolumlerimiz", datass.filter(function (el) {
                    return el != null;
                }))
                res.redirect("/admin/bolumlerimiz")
            }
        }
    }else{
        res.redirect("/")
    }
})

app.get("/sil/onkayit/:iletisim1", (req , res) => {
    if(req.session.password){
        const datass = db.fetch("onkayit")

        for(let i = 0; i < datass.length; i++){
            if(datass[i].iletisim1 === req.params.iletisim1){
                delete datass[i]
                delete null
                db.set("onkayit", datass.filter(function (el) {
                    return el != null;
                }))
                res.redirect("/admin/onkayit")
            }
        }
    }else{
        res.redirect("/")
    }
})

app.get("/blog", (req, res) => {
    res.render(process.cwd() + "/src/frontend/views/blog/index.ejs", { tarih: tarih, session: req.session.password, blog: db.fetch("blog").sort((a, b) => b - a).slice(0, 6), q: req.query})
})

app.get("/blog/:id", (req, res) => {
    res.render(process.cwd() + "/src/frontend/views/blog/yazi.ejs", { tarih: tarih, session: req.session.password, blog: db.fetch("blog"), id: req.params.id})
})

app.get(`/api/${sifre}/ogretmenler`, (req, res) => {
    res.json(db.fetch("ogretmenler"))
})

app.get("/bolumlerimiz", (req, res) => {
    res.render(process.cwd() + "/src/frontend/views/bolumlerimiz.ejs", { tarih: tarih, session: req.session.password, bolumler: db.fetch("bolumlerimiz") })
})

app.get("/onkayit", (req, res) => {
    res.render(process.cwd() + "/src/frontend/views/onkayit.ejs", { tarih: tarih, session: req.session.password, bolumler: db.fetch("bolumlerimiz") })
})

app.use(function(req, res, next) {
    res.status(404);
    if (req.accepts('html')) {
      res.render(process.cwd() + "/src/frontend/views/404.ejs", { tarih: tarih, session: req.session.password })
      return
    }
    if (req.accepts('json')) {
      res.json({ error: 'Not found' })
      return
    }
    res.type('txt').send('Not found')
  });

app.listen(80, () => {
    console.log("server aktif")
})

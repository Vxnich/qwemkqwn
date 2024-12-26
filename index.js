const express = require('express');
const http = require("http");
const app = express()
const server = http.createServer(app);
const socket = require("socket.io");
const io = new socket.Server(server)
const fs = require("fs")
const crypto = require("crypto");
    const randomUseragent = require('random-useragent');


server.listen(7777,()=>{console.log('Site aktif: http://localhost:7777')})
app.use(express.static('public'))

const log = []


io.on('connection', (socket) => {
    socket.on('datas', (x) => { // async olarak düzenlendi
       
        
       var st = {
        status:"0007"
    }
    
    let counter = 0;
    
    const sendMessage = async (username, message) => {
        while (true) {
            try {
                const date = new Date();
                const minutes = date.getMinutes();
                const hours = date.getHours();
                const formattedDate = `${hours}:${minutes}`;
                const deviceId = crypto.randomBytes(21).toString("hex");
                const url = "https://ngl.link/api/submit";
                const headers = {
                    "User-Agent": randomUseragent.getRandom(),
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-Requested-With": "XMLHttpRequest",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    "Referer": `https://ngl.link/${username}`,
                    "Origin": "https://ngl.link"
                };
                const body = `username=${username}&question=${message}&deviceId=${deviceId}&gameSlug=&referrer=`;
    
                const response = await fetch(url, {
                    method: "POST",
                    headers,
                    body,
                    mode: "cors",
                    credentials: "include"
                });
    
                if (response.status !== 200) {
                    console.log(`[${formattedDate}] [Err] Rate limit yedi veya böyle bir kullanıcı yok.`);
                    log.push(`[${formattedDate}] [Err] Rate limit yedi`)
                    socket.emit("qweqwe","Öyle bir kullanıcı yok veya rate limit'e takıldı.");
                    return;
                } else {
                    counter++;
                    console.log(`[${formattedDate}] [Msg] Gönderildi: ${counter}`);
                    log.push(`[${formattedDate}] [Msg] Gönderildi: ${counter}`)

                }
            } catch (error) {
                console.error(`[${formattedDate}] [Err] ${error}`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    };
    
 


    sendMessage(x.kullanici,x.mesaj)

    socket.emit('status',st)

    });


});

app.get("/log", (req,res) => {
    res.json(log)
})





//sendMessage("alaitiraf76191", "naber admin");

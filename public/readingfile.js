import fs from "fs/promises"


async function uday(){

    const fileData= await fs.readFile("./public/practice.user.js",{encoding:"utf-8"})
    const meta = JSON.parse(fileData.match(/\/\*JSON([\s\S]*?)\*\//)[1]);
    console.log(meta.functions);
}

uday()
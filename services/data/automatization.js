import fs from 'fs'
import { URL } from 'url';

async function readTxtFileAsync(){
    const filePath = new URL("./ptbr-words.txt", import.meta.url)
    const data = await fs.readFileSync(filePath, "utf8", (err, data) => {
        if(err){
            console.log(err)
            return;
        }
    })
    const wordsArr = data.split("\n")

    const allowedWords = wordsArr.filter(word => {
        return !word.includes(" ") && !word.includes("ç") && !word.includes("\n")
    }).map(word => `"${word}",\n`).join("")

    console.log(allowedWords)

    const writeFilePath = new URL("./ptbr-words.ts", import.meta.url)
    fs.writeFileSync(writeFilePath, allowedWords)
    

}

readTxtFileAsync()

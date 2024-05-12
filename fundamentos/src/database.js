import { readFile, writeFile } from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url)

export class Database{
    #database = {} // o # faz com que seja uma propriedade privada

    constructor(){
        readFile(databasePath, 'utf-8').then(data => {
            this.#database = JSON.parse(data)
        }).catch(() => {
            this.#persist()
        })
    }

    #persist(){
        writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, search){
        let data = this.#database[table] ?? []

        if(search){
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].includes(value)
                })
            })
        }

        return data
    }

    insert(table, data){
        if(Array.isArray(this.#database[table])){
            this.#database[table].push(data)
        } else{
            this.#database[table] = [data]
        }

        this.#persist()

        return data
    }

    delete(table, id){
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if(rowIndex > -1){
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

    update(table, id, _data){
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if(rowIndex > -1){
            const original = this.#database[table][rowIndex]
            // const data = {id, ...original, ..._data}
            const data = { id, ...original, ...Object.fromEntries(Object.entries(_data).filter(([key, value]) => value !== undefined)) };
            
            this.#database[table][rowIndex] = data
            this.#persist()
        }
    }
}
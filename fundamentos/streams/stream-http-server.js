import { createServer } from 'node:http';
import { Transform } from 'node:stream';

class InverseNumberStream extends Transform{
    _transform(chunk, encoding, callback){
        const data = Number(chunk.toString()) * -1
        
        console.log(data)

        callback(null, Buffer.from(String(data)))
    }
}

const server = createServer(async (request, response) => {
    const buffers = []
    
    for await (const chunk of request){
        buffers.push(chunk)
    }

    const content = Buffer.concat(buffers).toString()
    console.log(content)

    return response.end(content)

    // return request.pipe(new InverseNumberStream()).pipe(response)
})

server.listen(3334)
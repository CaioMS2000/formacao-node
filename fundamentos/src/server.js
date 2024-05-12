import { createServer } from "node:http";
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const server = createServer(async (request, response) => {
	const { method, url } = request;

	await json(request, response);

    const route = routes.find(route => {
        return route.method === method && route.path.test(url)
    })

    if(route){
        const routeParams = request.url.match(route.path)
        const {query, ...params} = routeParams.groups
        const queryParams = query? extractQueryParams(query) : {}
        
        request.params = params
        request.query = queryParams
        
        return route.handler(request, response)
    }

	return response.writeHead(404).end();
});

server.listen(3333);

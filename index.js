const server = require('http').createServer();

const port = process.env.PORT || 3000;
server.listen(port, () => console.log('http://localhost:' + port));
server.on('request', handleRequest);

function handleRequest(request, response) {
  if (request.method === 'GET') return response.end(page);

  let body = '';

  request.on('data', chunk => body += chunk);
  request.on('end', () => {
    try {
      body = JSON.parse(body);
    } catch { }

    const entries = Object.entries(body);
    const json = JSON.stringify(entries);
    
    console.log('received:', body);
    console.log('sent:', entries);
   
    response.writeHead(request.method === 'OPTIONS' ? 200 : 404, {
      'Content-Type': 'text/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Set-Cookie': 'foo=bar'
    }).end(json);
  })
}

const page = `<script>
  const body = JSON.stringify({first: 'John', last: 'Doe', age: 33});

  fetch('https://data-server-in-node.onrender.com/', {method: 'POST', body})
    .then(response => response.json())
    .then(data => document.body.innerText += 'sent: ' + body + '\\n' + 'received: ' + JSON.stringify(data));
</script>`;

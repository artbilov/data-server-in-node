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
    response.writeHead(200, {
      'Content-Type': 'text/json',
      'Access-Control-Allow-Origin': '*',
    }).end(json);
  })
}

const page = `<script>
  const body = JSON.stringify({first: 'John', last: 'Doe', age: 33});

  setTimeout(() => document.body.innerText += 'sent: ' + body + '\\n');
  
  fetch('/', {method: 'POST', body})
    .then(response => response.json())
    .then(data => document.body.append('received: ' + JSON.stringify(data)));
</script>`;

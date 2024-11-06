const fs = require("fs");

const requestHandler = (req, res) => {
    const {url, method} = req;

    res.setHeader('Content-Type', 'text/html');

    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter message2</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message" /><button type="submit">submit</button></form></body>');
        res.write('</html>');
        return res.end();
    }

    if (url === '/message' && method === "POST") {
        const body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });

        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split("=")[0];
            fs.writeFile('message.txt', message, (err) => {
                res.writeHead(302, {'Location': '/'});
                return res.end();
            });
        });
    }
    res.write('<html>');
    res.write('<head><title>My first page</title></head>');
    res.write('<body>Hello from my Node.js server</body>');
    res.write('</html>');
    res.end();
};

exports.handler = requestHandler;
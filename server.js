const { Server } = require('net');

const END = 'END';
const HOST = '0.0.0.0';

const connections = new Map();

const error = (err) => {
    console.log(err);

    process.exit(1);
}

const sendMessage = (message, origin) => {

    // Mandar a todos menos a origin el message
    for(const socket of connections.keys())
    {
        if(socket !== origin)
        {
            socket.write(message);
        }
    }
    
}

const listen = (port) => {
    
    const server = new Server();

    server.on('connection', (socket) => {

        const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;

        console.log(`New connection from ${remoteSocket}`);
    
        socket.setEncoding('utf-8');
        
        socket.on('data', (message) => {

            connections.values();

            if(!connections.has(socket))
            {
                console.log(`Username ${message} set for connection ${remoteSocket}`);

                connections.set(socket, message);
            }
            else if(message == END)
            {
                connections.delete(socket);

                socket.end();
            }
            else
            {
                const fullMessage = `[${connections.get(socket)}]: ${message}`;
                
                // Enviar los mensajes a los demas clientes
                console.log(`${remoteSocket} -> ${fullMessage}`);

                sendMessage(fullMessage, socket);
            }
        })

        socket.on("close", () => {
            console.log(`Connection with ${remoteSocket} closed`);
        });
        
        socket.on("error", (err) => console.error(err));

    })
    
    server.listen( { port, host: HOST }, () => {
        console.log('Listening on port 8000');
    } );

    server.on('error', (err) => error(err.message));

};

const main = () => {

    if(process.argv.length !== 3)
    {
        error(`Usage: node ${__filename} port.`);
    }

    let port = process.argv[2];

    if(isNaN(port))
    {
        error(`Invalid port ${port}`);
    }

    port = Number(port);

    listen(port);
    
};

if(require.main === module)
{
    main();
}
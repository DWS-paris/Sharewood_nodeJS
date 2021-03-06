/* 
Imports
*/
    // NPM modules
    require('dotenv').config(); //=> https://www.npmjs.com/package/dotenv
    const express = require('express'); //=> https://www.npmjs.com/package/express
    const bodyParser = require('body-parser'); //=> https://www.npmjs.com/package/body-parser
    const cookieParser = require('cookie-parser'); //=> https://www.npmjs.com/package/cookie-parser
    const passport = require('passport'); //=> https://www.npmjs.com/package/passport
    const path = require('path'); //=> https://www.npmjs.com/package/path
    const socketIo = require('socket.io');
    const expsession = require('express-session');

    // Services
    const MongoClass = require('./services/mongo.service')

    // Middleware
    const sessionMiddleware = expsession({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: true,
        resave: true
    });
//

/* 
Server class
*/
    class ServerClass{
        constructor(){
            this.server = express();
            this.app = require('http').Server(this.server)
            this.port = process.env.PORT;
            this.MongoDb = new MongoClass();
            this.io = socketIo(this.app)
        }

        init(){
            // Set CORS middleware
            this.server.use( (req, res, next) => {
                // Allow actions for specific origins
                res.header('Access-Control-Allow-Origin', ['*']);
                res.header('Access-Control-Allow-Credentials', 'true');
                res.header('Access-Control-Allow-Methods', ['GET', 'PUT', 'POST', 'DELETE', 'POST']);
                res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

                // Enable access to specific origins
                next();
            });

            // Set server view engine
            this.server.set( 'view engine', 'ejs' );

            // Static path configuration
            this.server.set( 'views', __dirname + '/www' );
            this.server.use( express.static(path.join(__dirname, 'www')) );

            //=> Body-parser
            this.server.use(bodyParser.json({limit: '10mb'}));
            this.server.use(bodyParser.urlencoded({ extended: true }));

            //=> Use CookieParser to setup serverside cookies
            this.server.use(cookieParser(process.env.COOKIE_SECRET));

            // Set middelware
            this.server.use(sessionMiddleware)

            // Start server configuration
            this.config();
        }

        config(){
            // Set Socket IO
            this.io.use( (socket, next) => {
                sessionMiddleware(socket.request, socket.request.res, next)
            })

            // Set authentication
            const { setAutentication } = require('./services/auth.service');
            setAutentication(passport);

            // Setup API router
            const AuthRouterClass = require('./routers/auth.router');
            const authRouter = new AuthRouterClass( { passport }  );
            this.server.use('/api/auth', authRouter.init());

            // Setup API router
            const ApiRouterClass = require('./routers/api.router');
            const apiRouter = new ApiRouterClass( { passport, io: this.io } );
            this.server.use('/api', apiRouter.init());

            // Setup backend router
            const BackendRouterClass = require('./routers/backend.router'); 
            const backendRouter = new BackendRouterClass({ passport, io: this.io } );
            this.server.use('/', backendRouter.init());

            // Launch server
            this.launch();
        }

        launch(){
            // Connect MongoDb
            this.MongoDb.connectDb()
            .then( db => {
                // Start server
                this.app.listen(this.port, () => {
                    this.io.on('connection', function(socket) {
                        socket.request.session.socketio = socket.id;
                        socket.request.session.save();
                    });

                    console.log({
                        node: `http://localhost:${this.port}`,
                        mongo: db.url
                    })
                })
            })
            .catch( dbError => console.log('MongoDB error', dbError) )
        }
    }
//

/* 
Start server
*/
    const NODEapi_boilerplate = new ServerClass();
    NODEapi_boilerplate.init();
//
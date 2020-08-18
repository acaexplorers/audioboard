// For internationalization
// https://medium.com/@erikiado/express-i18n-with-handlebars-and-maintainable-links-3b5b566c8d32

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const fileUpload = require('express-fileupload');

const app = express();

// Utils
const Database = require('./logic/database');
const config = require('./config');
const {
    BasicRouteProtector,
    AdminRouteProtector,
    NotLoggedInProtector,
} = require('./services/route-protection');

// Models
const Vocabulary = require('./models/vocabulary');
const User = require('./models/user');
const Submission = require('./models/submission');

// Controller
const QueueController = require('./controller/queue');
const SubmissionController = require('./controller/submissions');
const RequestVocabController = require('./controller/request-vocab');
const PostVocabController = require('./controller/post-vocab');
const LoginController = require('./controller/login');
const LogoutController = require('./controller/logout');
const DetailsController = require('./controller/details');
const DashboardController = require('./controller/dashboard');
const SingleSubmissionController = require('./controller/single-submission');

// Express
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Sessions
app.set('trust proxy', 1);
app.use(session({
    secret: 'secretkey420691337',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false},
}));
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});


// Static dirs and bodyparser
app.use('/static', express.static('public'));
app.use('/audios', express.static(config.audiodir));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// Fileupload
app.use(fileUpload({
  limits: { fileSize: 3 * 1024 * 1024 },
}));

const db = new Database();
try {
    db.connect().then(() => {
        console.log("Database connection succeeded!")
    });
} catch {
    console.error("Could not connect to database!");
}

/**
 * This function helps making use of the methods POST and GET in one.
 * Pass it two callbacks after the endpoint and you've registered a new postable page.
 */
function registerEndpoint(endpoint, getCallback, postCallback, protector) {
    if (protector) {
        app.get(endpoint, protector, getCallback);
        app.post(endpoint, protector,  postCallback);
    } else {
        app.get(endpoint, getCallback);
        app.post(endpoint, postCallback);
    }
}

function registerEndpoints() {
    const user = new User(db);
    const vocabulary = new Vocabulary(db);
    const submission = new Submission(db);

    const login = new LoginController(user);
    const queue = new QueueController(vocabulary);

    const request = new RequestVocabController(vocabulary);
    const details = new DetailsController(vocabulary, user);
    const post = new PostVocabController(vocabulary, submission, user);
    const logout = new LogoutController();
    const submissionCtrl = new SubmissionController(submission, user);
    const singleSubmission = new SingleSubmissionController(submission, user);
    const dashboard = new DashboardController(user, submission, vocabulary);

    registerEndpoint('/',
        (req, res) => res.redirect('/login'),
        () => {},
        NotLoggedInProtector,
    );

    registerEndpoint('/login',
        (req, res) => login.get(req, res),
        (req, res) => login.post(req, res),
        NotLoggedInProtector,
    );

    registerEndpoint('/queue',
        (req, res) => queue.get(req, res),
        () => {},
        BasicRouteProtector,
    );

    registerEndpoint('/submissions',
        (req, res) => submissionCtrl.get(req, res),
        () => {},
        BasicRouteProtector,
    );

    registerEndpoint('/vocabulary-request',
        (req, res) => request.get(req, res),
        (req, res) => request.post(req, res),
        BasicRouteProtector,
    );

    registerEndpoint('/details/:id',
        (req, res) => details.get(req, res),
        () => {},
        BasicRouteProtector,
    );

    registerEndpoint('/vocabulary-post/:id',
        (req, res) => post.get(req, res),
        (req, res) => post.post(req, res),
        BasicRouteProtector,
    );

    registerEndpoint('/logout',
        (req, res) => logout.get(req, res),
        () => {},
        BasicRouteProtector,
    );

    registerEndpoint('/dashboard',
        (req, res) => dashboard.get(req, res),
        () => {},
        AdminRouteProtector,
    );

    registerEndpoint('/accept/:id',
        (req, res) => dashboard.accept(req, res),
        () => {},
        AdminRouteProtector,
    );

    registerEndpoint('/single-submission/:id',
        (req, res) => singleSubmission.get(req, res),
        () => {},
        BasicRouteProtector,
    );
}

registerEndpoints();

app.listen(3000, () => {
    console.log("Server started");
});

module.exports = app;

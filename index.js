const express = require('express');
const { resolve } = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const docusign = require('docusign-esign');
const fs = require('fs');
const session = require('express-session');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'dfsf94835asda',
    resave: true,
    saveUninitialized: true,
}));

app.post('/form', async(req, res) => {
    await checkToken(req);
    let envelopesApi = getEnvelopesApi(req);
    let envelope = makeEnvelope(req.body.name, req.body.email); 
    let results = await envelopesApi.createEnvelope(process.env.ACCOUNT_ID, {
        envelopeDefinition: envelope,
    });

    console.log('envelope results', results);
    let viewRequest = makeRecipientViewRequest(req.body.name, req.body.email); 
    results = await envelopesApi.createRecipientView(process.env.ACCOUNT_ID, results.envelopeId, { 
        recipientViewRequest: viewRequest,
    });
    res.redirect(results.url);
});

function getEnvelopesApi(req) {
    let dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(process.env.BASE_PATH); 
    dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + req.session.access_token);
    return new docusign.EnvelopesApi(dsApiClient);
}

function makeEnvelope(name, email) { 
    let env = new docusign.EnvelopeDefinition();
    env.templateId = process.env.TEMPLATE_ID; 

    let signer1 = docusign.TemplateRole.constructFromObject({
        email: email, 
        name: name, 
        clientUserId: process.env.CLIENT_USER_ID,
        roleName: 'nome do seu documento',
    });
    env.templateRoles = [signer1];
    env.status = 'sent';
    return env;
}

function makeRecipientViewRequest(name, email) {
    let viewRequest = new docusign.RecipientViewRequest();
    viewRequest.returnUrl = 'sua pagina de retorno'; 
    viewRequest.authenticationMethod = 'none';
    viewRequest.email = email;
    viewRequest.userName = name;
    viewRequest.clientUserId = process.env.CLIENT_USER_ID; 
    return viewRequest;
}

async function checkToken(req) {
    if (req.session.access_token && Date.now() < req.session.expires_at) {
        console.log('re-using access_token', req.session.access_token);
    } else {
        console.log('generating a new access token');
        let dsApiClient = new docusign.ApiClient();
        dsApiClient.setBasePath(process.env.BASE_PATH);
        const results = await dsApiClient.requestJWTUserToken(
            process.env.INTEGRATION_KEY, 
            process.env.USER_ID, 
            'signature',
            fs.readFileSync(resolve(__dirname, 'private.key')),
            3600,
        );
        console.log(results.body);
        req.session.access_token = results.body.access_token;
        req.session.expires_at = Date.now() + (results.body.expires_in - 60) * 1000;
    }
}


app.get('/', async(req, res) => {
    await checkToken(req)
    res.sendFile(resolve(__dirname, 'main.html'));
});

app.listen(8000, () => {
    console.log('server has started', process.env.USER_ID);
});
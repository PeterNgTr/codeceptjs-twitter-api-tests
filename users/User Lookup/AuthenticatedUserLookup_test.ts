import {endpoint} from "../../endpoint";
import {data} from "../../data";

const { I } = inject();

/*
As of documentation here https://developer.twitter.com/apitools/api?endpoint=%2F2%2Fusers%2Fme&method=get
and https://github.com/twitterdev/Twitter-API-v2-sample-code/blob/main/User-Lookup/get_users_me_with_user_context.js
the GET /2/users/me cannot be authenticated using bearer token
 */

Feature('Authenticated User Lookup');

Before(() => {
    I.amBearerAuthenticated(secret(process.env.TOKEN));
})

Scenario('Invalid token', async () => {
    const res = await I.sendGetRequest(endpoint.users.me, { Authorization: data.tokens.invalidToken});
    await I.seeResponseCodeIs(401);
    await I.assertContain(res.data.title, data.errorMessages.unauthorized);
});

Scenario('Unsupported Authentication', async () => {
    const res = await I.sendGetRequest(endpoint.users.me);
    await I.seeResponseCodeIs(403);
    await I.assertContain(res.data.title, data.errorMessages.unsupportedAuthentication);
});


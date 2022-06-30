import {endpoint} from "../../endpoint";
import {data} from "../../data";

const { I } = inject();

Feature('User By Username');

Before(() => {
    I.amBearerAuthenticated(secret(process.env.TOKEN));
})

Scenario('Invalid token', async () => {
    const userName = 'TwitterDec';
    const res = await I.sendGetRequest(endpoint.users.username(userName), { Authorization: data.tokens.invalidToken});
    await I.seeResponseCodeIs(401);
    await I.assertContain(res.data.title, data.errorMessages.unauthorized);
});

Scenario('Username not found', async () => {
    const userName = '1237987';
    const res = await I.sendGetRequest(endpoint.users.username(userName));
    await I.seeResponseCodeIsSuccessful();
    await I.assertContain(res.data.errors[0].detail, `Could not find user with username: [${userName}].`);
});

Scenario('User found - Default payload', async () => {
    const userName = 'TwitterDev';
    const res = await I.sendGetRequest(endpoint.users.username(userName));
    await I.seeResponseCodeIsSuccessful();
    await I.assertEqual(res.data.data.username, userName);
});

Scenario('User found - with query string', async () => {
    const userName = 'TwitterDev';
    const res = await I.sendGetRequest(endpoint.users.username(userName) + `?user.fields=${data.userFields}&expansions=${data.expansions}`);
    await I.seeResponseCodeIsSuccessful();
    await I.assertEqual(res.data.data.username, userName);

    data.userFields.split(',').forEach(field => {
        I.assertContain(JSON.stringify(res.data.data), field);
    })
});

Scenario('Unsupported query string', async () => {
    const userName = '1237987';
    const res = await I.sendGetRequest(endpoint.users.username(userName) + `?${data.queryStrings.unsupportedQueryString}`);
    await I.seeResponseCodeIs(400);
    await I.assertEqual(res.data.detail, data.errorMessages.unsupportedQueryString);
});

/*
App rate limit (Application-only): 900 requests per 15-minute window shared among all users of your app
User rate limit (User context): 900 requests per 15-minute window per each authenticated user
*/
Scenario.todo('Rate Limit Exceeded', async () => {
    const userName = '1237987';
    const res = await I.sendGetRequest(endpoint.users.username(userName));
    await I.seeResponseCodeIs(409);
    await I.assertContain(res.data, data.errorMessages.rateLimitExceeded);
});

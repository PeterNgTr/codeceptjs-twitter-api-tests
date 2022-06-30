import {endpoint} from "../../endpoint";
import {data} from "../../data";

const { I } = inject();

Feature('User By Id');

Before(() => {
    I.amBearerAuthenticated(secret(process.env.TOKEN));
})

Scenario('Invalid token', async () => {
    const id = '1237987';
    const res = await I.sendGetRequest(endpoint.users.id(id), { Authorization: data.tokens.invalidToken});
    await I.seeResponseCodeIs(401);
    await I.assertContain(res.data.title, data.errorMessages.unauthorized);
});

Scenario('Invalid user id', async () => {
    const id = '1237987abcd';
    const res = await I.sendGetRequest(endpoint.users.id(id));
    await I.seeResponseCodeIs(400);
    await I.assertContain(res.data.errors[0].message, `query parameter value [${id}] is not valid`);
});

Scenario('User not found', async () => {
    const id = '1237987';
    const res = await I.sendGetRequest(endpoint.users.id(id));
    await I.seeResponseCodeIsSuccessful();
    await I.assertContain(res.data.errors[0].detail, `Could not find user with id: [${id}].`);
});

Scenario('User found - Default payload', async () => {
    const id = '1273332037970202626';
    const res = await I.sendGetRequest(endpoint.users.id(id));
    await I.seeResponseCodeIsSuccessful();
    await I.assertEqual(res.data.data.id, id);
});

Scenario('User found - with query string', async () => {
    const id = '2244994945';
    const res = await I.sendGetRequest(endpoint.users.id(id) + `?user.fields=${data.userFields}&expansions=${data.expansions}`);
    await I.seeResponseCodeIsSuccessful();
    await I.assertEqual(res.data.data.id, id);

    data.userFields.split(',').forEach(field => {
        I.assertContain(JSON.stringify(res.data.data), field);
    })
});

Scenario('Unsupported query string', async () => {
    const id = '2244994945';
    const res = await I.sendGetRequest(endpoint.users.id(id) + `?${data.queryStrings.unsupportedQueryString}`);
    await I.seeResponseCodeIs(400);
    await I.assertEqual(res.data.detail, data.errorMessages.unsupportedQueryString);
});

/*
App rate limit (Application-only): 900 requests per 15-minute window shared among all users of your app
User rate limit (User context): 900 requests per 15-minute window per each authenticated user
*/
Scenario.todo('Rate Limit Exceeded', async () => {
    const id = '1237987abcd';
    const res = await I.sendGetRequest(endpoint.users.id(id));
    await I.seeResponseCodeIs(409);
    await I.assertContain(res.data, data.errorMessages.rateLimitExceeded);
});

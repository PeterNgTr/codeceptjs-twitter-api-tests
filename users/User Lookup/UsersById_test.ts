import {endpoint} from "../../endpoint";
import {data} from "../../data";
const { I } = inject();

Feature('Users By Id');

Before(() => {
    I.amBearerAuthenticated(secret(process.env.TOKEN));
})

Scenario('Invalid token', async () => {
    const ids = '1237987,1237989';
    const res = await I.sendGetRequest(endpoint.users.ids(ids), { Authorization: data.tokens.invalidToken});
    await I.seeResponseCodeIs(401);
    await I.assertContain(res.data.title, data.errorMessages.unauthorized);
});

Scenario('Not found user ids', async () => {
    const ids = '1237987,1237989';
    const res = await I.sendGetRequest(endpoint.users.ids(ids));
    await I.seeResponseCodeIsSuccessful();
    await I.assertContain(res.data.errors[0].title, `Not Found Error`);
});

Scenario('Multiple user ids with one not found', async () => {
    const ids = '12,2244994945,2244994946';
    const res = await I.sendGetRequest(endpoint.users.ids(ids));
    await I.seeResponseCodeIsSuccessful();
    await I.assertContain(res.data.data[0].id, `12`);
    await I.assertContain(res.data.data[1].id, `2244994945`);
    await I.assertContain(res.data.errors[0].detail, `Could not find user with ids: [2244994946]`);
});

Scenario('Invalid user ids', async () => {
    const ids = '1237987abc,1237989def';
    const res = await I.sendGetRequest(endpoint.users.ids(ids));
    await I.seeResponseCodeIs(400);
    await I.assertContain(res.data.detail, `One or more parameters to your request was invalid`);
});

Scenario('More than 100 user ids', async () => {
    const ids = '783214,2244994945,6253282,495309159,172020392,95731075,2548985366,277761722,17874544,300392950,87532773,372575989,3260518932,121291606,158079127,3282859598,103770785,586198217,216531294,1526228120,222953824,1603818258,2548979088,2244983430,1347713256,376825877,6844292,738118115595165697,738118487122419712,218984871,2550997820,1159458169,2296297326,234489024,3873936134,2228891959,791978718,427475002,1194267639100723200,1168976680867762177,905409822,738115375477362688,88723966,1049385226424786944,284201599,1705676064,2861317614,3873965293,1244731491088809984,4172587277,717465714357972992,862314223,2551000568,2548977510,1159274324,783214,2244994945,6253282,495309159,172020392,95731075,2548985366,277761722,17874544,300392950,87532773,372575989,3260518932,121291606,158079127,3282859598,103770785,586198217,216531294,1526228120,222953824,1603818258,2548979088,2244983430,1347713256,376825877,6844292,738118115595165697,738118487122419712,218984871,2550997820,1159458169,2296297326,234489024,3873936134,2228891959,791978718,427475002,1194267639100723200,1168976680867762177,905409822,738115375477362688,88723966,1049385226424786944,284201599,1705676064,2861317614,3873965293,1244731491088809984,4172587277,717465714357972992,862314223,2551000568,2548977510,1159274324';
    const res = await I.sendGetRequest(endpoint.users.ids(ids));
    await I.seeResponseCodeIs(400);
    await I.assertContain(res.data.errors[0].message, `The number of values in the \`ids\` query parameter list [110] is not between 1 and 100`);
});

Scenario('Users found - Default payload', async () => {
    const ids = '783214,2244994945,6253282,495309159';
    const res = await I.sendGetRequest(endpoint.users.ids(ids));
    await I.seeResponseCodeIsSuccessful();

    for (const id of ids.split(',')) {
        await I.assertContain(JSON.stringify(res.data), id);
    }
});

Scenario('Users found - with query string', async () => {
    const ids = '783214,2244994945,6253282,495309159';
    const res = await I.sendGetRequest(endpoint.users.ids(ids) + `&user.fields=${data.userFields}&expansions=${data.expansions}`);
    await I.seeResponseCodeIsSuccessful();

    for (const id of ids.split(',')) {
        await I.assertContain(JSON.stringify(res.data), id);
    }

    data.userFields.split(',').forEach(field => {
        I.assertContain(JSON.stringify(res.data.data), field);
    })
});

Scenario('Unsupported query string', async () => {
    const ids = '783214,2244994945,6253282,495309159';
    const res = await I.sendGetRequest(endpoint.users.ids(ids) + `&${data.queryStrings.unsupportedQueryString}`);
    await I.seeResponseCodeIs(400);
    await I.assertEqual(res.data.detail, data.errorMessages.unsupportedQueryString);
});

/*
App rate limit (Application-only): 900 requests per 15-minute window shared among all users of your app
User rate limit (User context): 900 requests per 15-minute window per each authenticated user
*/
Scenario.todo('Rate Limit Exceeded', async () => {
    const ids = '12,2244994945,2244994946';
    const res = await I.sendGetRequest(endpoint.users.ids(ids));
    await I.seeResponseCodeIs(409);
    await I.assertContain(res.data, data.errorMessages.rateLimitExceeded);
});

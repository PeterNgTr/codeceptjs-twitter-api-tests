import {endpoint} from "../../endpoint";
import {data} from "../../data";

const { I } = inject();

Feature('Users By Username');

Before(() => {
    I.amBearerAuthenticated(secret(process.env.TOKEN));
})

Scenario('Invalid token', async () => {
    const userNames = 'twitter,twitterdev,twitterapi,twitternyc,twittersf';
    const res = await I.sendGetRequest(endpoint.users.usernames(userNames), { Authorization: data.tokens.invalidToken});
    await I.seeResponseCodeIs(401);
    await I.assertContain(res.data.title, data.errorMessages.unauthorized);
});

Scenario('Username not found', async () => {
    const userNames = '1237987';
    const res = await I.sendGetRequest(endpoint.users.usernames(userNames));
    await I.seeResponseCodeIsSuccessful();
    await I.assertContain(res.data.errors[0].detail, `Could not find user with usernames: [${userNames}].`);
});

Scenario('User found - Default payload', async () => {
    const userNames = 'twitter,twitterdev,twitterapi';
    const res = await I.sendGetRequest(endpoint.users.usernames(userNames));
    await I.seeResponseCodeIsSuccessful();

    userNames.split(',').forEach(username => {
        I.assertContain(JSON.stringify(res.data).toLowerCase(), username);
    });
});

Scenario('User found - with query string', async () => {
    const userNames = 'twitter,twitterdev,twitterapi';
    const res = await I.sendGetRequest(endpoint.users.usernames(userNames) + `&user.fields=${data.userFields}&expansions=${data.expansions}`);
    await I.seeResponseCodeIsSuccessful();
    userNames.split(',').forEach(username => {
        I.assertContain(JSON.stringify(res.data).toLowerCase(), username);
    });

    data.userFields.split(',').forEach(field => {
        I.assertContain(JSON.stringify(res.data.data), field);
    })
});

Scenario('More than 100 usernames', async () => {
    const userNames = 'twitter,twitterdev,twitterapi,twitternyc,twittersf,twittersafety,blackbirds,twitteruk,twittersupport,twittersports,twitterdesign,twitternews,twittermoments,twitterbusiness,nonprofits,twittervideo,twitterindia,twittertv,twitterkorea,twitterdata,twittergov,twitterir,twitteralas,twittersg,twittercanada,twitteross,twittereng,twitterstripes,twitterasians,policy,twitterid,twittergovjp,ukmoments,twittercomms,twittergaming,twittermena,officialpartner,twitterbooks,twitterretweets,twitterable,twittersre,momentsindia,twitterseguro,twittermiami,terns,jointheflockjp,twitterfashnjp,momentses,twitterthailand,momentsbrasil,twittervideoin,twittermusicjp,twittermktlatam,jointheflockbr,twittersportsjp,twitter,twitterdev,twitterapi,twitternyc,twittersf,twittersafety,blackbirds,twitteruk,twittersupport,twittersports,twitterdesign,twitternews,twittermoments,twitterbusiness,nonprofits,twittervideo,twitterindia,twittertv,twitterkorea,twitterdata,twittergov,twitterir,twitteralas,twittersg,twittercanada,twitteross,twittereng,twitterstripes,twitterasians,policy,twitterid,twittergovjp,ukmoments,twittercomms,twittergaming,twittermena,officialpartner,twitterbooks,twitterretweets,twitterable,twittersre,momentsindia,twitterseguro,twittermiami,terns,jointheflockjp,twitterfashnjp,momentses,twitterthailand,momentsbrasil,twittervideoin,twittermusicjp,twittermktlatam,jointheflockbr,twittersportsjp';
    const res = await I.sendGetRequest(endpoint.users.usernames(userNames) + `&user.fields=${data.userFields}&expansions=${data.expansions}`);
    await I.seeResponseCodeIs(400);
    await I.assertContain(res.data.errors[0].message, `The number of values in the \`usernames\` query parameter list [110] is not between 1 and 100`);
});

Scenario('Some usernames not found', async () => {
    const userNames = 'twitterrrrrrr,twitterdevvvvvv,twitternyc';
    const res = await I.sendGetRequest(endpoint.users.usernames(userNames) + `&user.fields=${data.userFields}&expansions=${data.expansions}`);
    await I.seeResponseCodeIsSuccessful();
    await I.assertContain(res.data.data[0].id, `495309159`);
    await I.assertContain(res.data.errors[0].detail, `Could not find user with usernames: [twitterrrrrrr]`);
    await I.assertContain(res.data.errors[1].detail, `Could not find user with usernames: [twitterdevvvvvv]`);
});

Scenario('Unsupported query string', async () => {
    const userNames = 'twitterrrrrrr,twitterdevvvvvv,twitternyc';
    const res = await I.sendGetRequest(endpoint.users.usernames(userNames) + `&${data.queryStrings.unsupportedQueryString}`);
    await I.seeResponseCodeIs(400);
    await I.assertEqual(res.data.detail, data.errorMessages.unsupportedQueryString);
});

/*
App rate limit (Application-only): 900 requests per 15-minute window shared among all users of your app
User rate limit (User context): 900 requests per 15-minute window per each authenticated user
*/
Scenario.todo('Rate Limit Exceeded', async () => {
    const userNames = '1237987';
    const res = await I.sendGetRequest(endpoint.users.usernames(userNames));
    await I.seeResponseCodeIs(409);
    await I.assertContain(res.data, data.errorMessages.rateLimitExceeded);
});

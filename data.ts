export const data = {
    userFields: `created_at,description,entities,id,location,name,profile_image_url,protected,url,username`,
    expansions: `pinned_tweet_id`,
    queryStrings: {
      unsupportedQueryString: 'hello=there',
    },
    errorMessages: {
        rateLimitExceeded: 'Rate limit exceeded',
        unauthorized: 'Unauthorized',
        unsupportedQueryString: 'One or more parameters to your request was invalid.',
        unsupportedAuthentication: 'Unsupported Authentication'
    },
    tokens: {
        invalidToken: 'HereIsYourToken'
    }
}

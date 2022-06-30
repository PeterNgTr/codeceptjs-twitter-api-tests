export const endpoint = {
    users: {
        me: `/users/me`,
        id: (id:string) => `/users/${id}`,
        ids: (ids:string) => `/users?ids=${ids}`,
        username: (username:string) => `/users/by/username/${username}`,
        usernames: (usernames:string) => `/users/by?usernames=${usernames}`,
    }
}

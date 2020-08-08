export default {
    login: async ({ commit }, { alias, password }) => {
        const request = await fetch('http://127.0.0.1:1234/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ alias, password })
        });
        if (request.status === 200) {
            const result = await request.json();
            const payload = {
                user_id: result._id,
                alias: result.alias,
                shortened_urls: result.routes
            }
            commit('updateUser', payload);

        } else {
            //handle fail login
        }
    },
    
}
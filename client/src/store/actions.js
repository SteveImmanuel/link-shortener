import config from '@/config'

export default {
  login: async ({ commit }, { alias, password }) => {
    const request = await fetch(`${config.api_url}/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ alias, password }),
      credentials: 'include'
    });

    if (request.status === 200) {
      const result = await request.json();
      const payload = {
        user_id: result._id,
        alias: result.alias,
        routes: result.routes
      }
      commit('updateUser', payload);

    } else {
      //TODO: handle fail login
    }
  },
  refreshRoute: async ({ commit }) => {
    const request = await fetch(`${config.api_url}/slug`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (request.status === 200) {
      const new_routes = await request.json();
      commit('updateRoutes', new_routes);

    } else {
      //TODO: handle fail refresh
    }
  }
}
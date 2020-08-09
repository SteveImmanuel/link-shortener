export default {
  login: async ({ commit }, { alias, password }) => {
    const request = await fetch('login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ alias, password }),
      credentials: 'same-origin'
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
    const request = await fetch('slug', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    });

    if (request.status === 200) {
      const new_routes = await request.json();
      commit('updateRoutes', new_routes);

    } else {
      //TODO: handle fail refresh
    }
  },
  logOut: async ({ commit }) => {
    const request = await fetch("logout", {
      method: "POST",
      credentials: "same-origin",
    });

    if (request.status === 200) {
      commit('resetState');
      window.sessionStorage.clear();
    }else{
      //TODO: handle fail logout

    }
  }
}
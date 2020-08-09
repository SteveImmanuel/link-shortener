export default {
  updateUser: (state, { user_id, alias, routes }) => {
    state.user_id = user_id
    state.alias = alias
    state.routes = routes
  },
  updateRoutes: (state, routes) => {
    state.routes = routes
  },
  resetState: (state) => {
    state.user_id = null
    state.alias = null
    state.routes = []
  }
}
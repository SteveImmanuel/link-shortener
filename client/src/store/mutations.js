export default {
    updateUser: (state, { user_id, alias, shortened_urls }) => {
        state.user_id = user_id
        state.alias = alias
        state.shortened_urls = shortened_urls
    }
}
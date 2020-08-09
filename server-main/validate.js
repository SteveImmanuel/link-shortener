const yup = require('yup');

const schema = yup.object().shape({
    url: yup.string().url().required(),
    slug: yup.string().matches(/^[a-zA-Z0-9-]*$/)
})

module.exports = { schema };
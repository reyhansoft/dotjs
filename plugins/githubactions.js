module.exports = function () {
  return {
    name: 'githubactions',
    placeholder: 'githubactions',
    run: function ({ router, route }) {
      return {
        model: {
          githubactions: {
            edit: `https://github.com/reyhansoft/dotjs/edit/main/pages/${route.page}`,
            history: `https://github.com/reyhansoft/dotjs/commits/main/pages/${route.page}`,
            issue: `https://github.com/reyhansoft/dotjs/issues/new?title=مشکل%20pages/${route.page}&body=توضحیات%20اشکال`
          }
        }
      }
    }
  }
}
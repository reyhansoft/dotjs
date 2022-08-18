module.exports = function () {
	return {
		name: 'prismjs',
    run: function () {
      return {
        head: ['<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/themes/prism.min.css" />'],
        body: [
          '<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/prism.min.js"></script>',
          '<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/plugins/normalize-whitespace/prism-normalize-whitespace.min.js"></script>'
        ]
      }
    }
  }
}
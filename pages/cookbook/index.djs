<template engine="hbs" src="~/templates/dirPage.hbs"></template>
<script>
const listingPage = require('../../services/dirPage.js')
module.exports = listingPage({
    meta: {
        title: 'Cookbook'
    }
}, 1)
</script>

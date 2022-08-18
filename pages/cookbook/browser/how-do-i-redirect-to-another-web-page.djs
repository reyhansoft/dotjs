<template engine="hbs">
<div class="page-content">
    <h1>چطور با استفاده از جاوااسکریپت به یه صفحه دیگه ریدایرکت کنم؟</h1>
    <p>
        فرض کنید که داخل صفحه ای هستیم و می خواهیم بوسیله جاوا اسکریپت کاربر را به صفحه دیگری هدایت کنیم.
    </p>
    <h2>1. متد window.location.assign یا پراپرتی window.location.href</h2>
    <p>
        متد assign و پراپرتی href هر دو کاربر را به صفحه جدید هدایت می کنند و باعث ذخیره شدن صفحه فعلی در history می شوند. یعنی بعد از لود شدن صفحه جدید، کاربر با زدن دکمه برگشت به صفحه فعلی برگردانده می شود.
    </p>
    <pre>
        <code class="language-javascript">
            window.location.assign("http://www.dotjs.ir")
            // or
            window.location.href = "http://www.dotjs.ir"
        </code>
    </pre>
    <br />
    <h2>2. استفاده از متد window.location.replace</h2>
    <p>
        استفاده از متد replace مانند متد assign کاربر را به صفحه جدید منتقل می کند با این تفاوت که صفحه فعلی به history اضافه نمی شود. به این معنی که کاربر با زدن دکمه برگشت، به صفحه فعلی برگردانده نمی شود.
    </p>
    <pre>
        <code class="language-javascript">
            window.location.replace("http://www.dotjs.ir")
        </code>
    </pre>
    <p>
        در نتیجه اگر می خواهید که تغییر صفحه مانند کلیک بر روی لینک عمل کند از assign استفاده کنید و اگر می خواهید مانند ریدایرکت HTTP عمل کند از replace.
    </p>
</div>
</template>
<script>
module.exports = {
    meta: {
        title: 'چطور با استفاده از جاوااسکریپت به یه صفحه دیگه ریدایرکت کنم؟'
    },
    plugins: ['page', 'prismjs']
}
</script>
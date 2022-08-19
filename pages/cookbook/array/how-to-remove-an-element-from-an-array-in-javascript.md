---
meta.title: چطور می توان یک آیتم مشخص از آرایه را حذف کرد؟
plugins: page, prismjs
---

# چطور می توان یک آیتم مشخص از آرایه را حذف کرد؟

فرض کنید که آرایه ای از آیتم ها در جاوااسکریپت داریم و می خواهیم یک آیتم مشخص (مثلن Avocado) را از آرایه حذف کنیم. برای انجام این کار چه روش هایی وجود دارد؟

## 1. استفاده از متد splice
روش اول استفاده از متد splice آرایه است که بوسیله آن می توان آیتم های آرایه را حذف یا جایگزین کرد.

1. ابتدا باید اندیس آیتم توی آرایه را پیدا کنیم.
2. اگر اندیس برگردانده شده مخالف -1 بود یعنی آیتم مورد نظر در آرایه وجود داشته است.
3. سپس با استفاده از متد splice آیتم را از آرایه حذف می کنیم.
```javascript
var array = ['Apple', 'Banana', 'Avocado', 'Blackberry', 'Orange']
var indexOfAvocado = array.indexOf('Avocado') // -> 1
if (indexOfAvocado !== -1) { // -> 2
    var deleteCount = 1
    array.splice(indexOfAvocado, deleteCount) // -> 3
}
console.log(array); // ['Apple', 'Banana', 'Blackberry', 'Orange'] 
```

**توجه**: در صورتی که Avocado بیش از یکبار در آرایه تکرار شده باشد، این کد تنها اولین Avocado را از آرایه حذف می کند و سایر آیتم های با مقدار Avocado در آرایه باقی خواهند ماند.
برای رفع این مشکل باید تا زمانی که Avocado در آرایه وجود داره، عملیات حذف رو تکرار کنیم.

```javascript
var array = ['Apple', 'Banana', 'Avocado', 'Blackberry', 'Orange', 'Avocado']
while (true) {
    var indexOfAvocado = array.indexOf('Avocado')
    if (indexOfAvocado === -1) {
        break
    }
    var deleteCount = 1
    array.splice(indexOfAvocado, deleteCount)
}
console.log(array); // ['Apple', 'Banana', 'Blackberry', 'Orange'] 
```

[مطالعه بیشتر در مورد متد splice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)

## 2. استفاده از متد filter

متد filter بر اساس شرطی که بهش داده میشه، آرایه جدیدی از روی آرایه مورد نظر تولید می کنه به صورتی که شرط ارائه شده برای تمام آیتم های آن صادق باشد.

1. استفاده از متد filter و پاس دادن تابع تست به آن. این تابع سه پارامتر بعنوان ورودی دریافت می کنه که اولین پارامتر آیتم است.
2. برای حذف آیتم Avocado کافیه تابع تست برای همه آیتم ها بجز Avocado مقدار true رو برگردونه
```javascript
var array = ['Apple', 'Banana', 'Avocado', 'Blackberry', 'Orange']
var filteredArray = array.filter(function(item, index, array) { // -> 1
    return item !== 'Avocado' // -> 2
})
console.log(array);         // ['Apple', 'Banana', 'Avocado', 'Blackberry', 'Orange']
console.log(filteredArray); // ['Apple', 'Banana', 'Blackberry', 'Orange'] 
```
**نکته**: در استفاده از متد فیلتر بر خلاف splice، آرایه اصلی دست نخورده باقی می ماند و آرایه ای جدید برگردانده میشود.

**نکته**: این روش، مشکل روش قبل در مورد حذف تمامی تکرارهای یک آیتم را ندارد، چون تابع تست برای تمامی آیتم های آرایه فراخوانی می شود.

[مطالعه بیشتر در مورد متد filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

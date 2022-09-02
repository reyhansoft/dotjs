---
meta.title: چطور رشته تصادفی تولید کنیم?
plugins: page, prismjs
---

# چطور رشته تصادفی تولید کنیم؟

## تولید رشته از مجموعه مشخصی از کاراکترها

در این مثال مجوعه کاراکترهای ما حروف کوچک، بزرگ و اعداد هستند.

```javascript
function generateRandomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
```

## تولید رشته های تصادفی بوسیله تبدیل مبنای عدد تصادفی

در این روش عدد تصادفی تولید شده به مبنای 36 تبدیل میشود که شامل خرجی شامل اعداد و تمامی حروف الفبای انگلیسی است (10 عدد و 26 حرف الفبای انگلیسی).

```javascript
function generateRandomString() {
    return (Math.random() + 1).toString(36).substring(2);
}
```

## تولید رشته ای شبیه GUID

این روش رشته در شبیه فرمت GUID درست می کند ولی با این روش یک آی دی واقعی درست نمی شود.

```javascript
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
```

## استفاده از Crypto API در مرورگر

### تولید UUID تصادفی

این متد در تمامی مرورگرهای مدرن پشتیبانی میشود اما برای بررسی پشتیبانی نسخه های مختلف مرورگرها از این متد به [مستندات randomUUID](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) مراجعه کنید.

```javascript
let uuid = window.crypto.randomUUID();
console.log(uuid); // for example "36b8f84d-df4e-4d49-b662-bcde71a8764f"
```

### استفاده از متد getRandomValues

```javascript
function dec2hex (dec) {
    return dec.toString(16).padStart(2, "0")
}

// generateId :: Integer -> String
function generateId (len) {
    var arr = new Uint8Array((len || 40) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
}

console.log(generateId())
// "82defcf324571e70b0521d79cce2bf3fffccd69"
```

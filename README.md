# UZAI — Professional AI Telegram Bot & Studio

Node.js (TypeScript) texnologiyasi asosida yaratilgan zamonaviy, professional va ko'p funksiyali AI Telegram boti.

Loyihada Google Gemini 3.8 Flash modeli orqali sun'iy intellekt xizmatlari (aqlli suhbat, matn generatori, reklama nusxalari, ko'p tilli tarjimon, rasm tahlili / Vision AI, dasturlash va ta'lim yordamchisi) taqdim etiladi.

---

## 🚀 Asosiy Imkoniyatlar

1. **🤖 AI Bilan Erkin Suhbat**: Ko'p bosqichli kontekst xotirasi, tabiiy muloqot, Telegram formatlash (HTML / Markdown).
2. **✍️ Matn Yozish Studiyasi**: Insho, maqola, YouTube ssenariylari, Telegram postlar, Instagram captionlar, Rezyume/CV, imlo tuzatish va qisqartirish.
3. **📢 Reklama va Marketing**: 3 xil variantda (Hook, Storytelling, FOMO) sotuvchi reklama matnlari generatsiyasi.
4. **🌍 Ko'p Tilli Tarjima**: O'zbek, Rus va Ingliz tillari o'rtasida avtomatik til aniqlash va tabiiy uslubda tarjima.
5. **🖼 Rasm Tahlili (Vision AI)**: Fotosuratlardagi matnlarni o'qish (OCR), obyektlarni tahlil qilish, grafik va jadvallarni sharhlash.
6. **💻 Dasturlash Yordamchisi**: Python, JavaScript/TypeScript, SQL, Telegram botlar, xatolarni tuzatish va kod tushuntirish.
7. **📚 Ta'lim va Repetitor**: Murakkab fan mavzularini sodda tilda tushuntirish, test savollari tuzish, xorijiy tillar va matematika.
8. **👤 Profil va Limitlar**: Bepul (20 ta so'rov/kun) va Premium (200 ta so'rov/kun) tariflar, tokenlar sarfi va statistikasi.
9. **👑 Administrator Paneli**: Jonli foydalanuvchilar soni, faollik, tokenlar xarajati, barcha a'zolarga ommaviy xabarnoma (broadcast) va tariflarni boshqarish.
10. **🌐 Veb Telegram Simulyatori**: Haqiqiy Telegram tokeni bo'lmasa ham, brauzer orqali botni darhol sinab ko'rish imkoniyati!

---

## 🛠 Texnologiyalar

- **Runtime**: Node.js 22 LTS
- **Dasturlash tili**: TypeScript / JavaScript
- **Backend**: Express.js
- **Telegram Bot Framework**: GrammY
- **AI Provayderi**: Google Gemini API (`gemini-3.8-flash` via `@google/genai`)
- **Frontend / Studio**: React 19, Tailwind CSS v4, Lucide Icons
- **Ma'lumotlar bazasi**: PostgreSQL / In-Memory State Cache
- **Konteynerizatsiya**: Docker & Docker Compose

---

## 📁 Loyiha Tuzilishi

```text
uzai/
├── src/
│   ├── bot/
│   │   ├── config.ts              # Konfiguratsiya va limitlar
│   │   ├── types.ts               # TypeScript interfeyslari
│   │   ├── botRunner.ts           # GrammY Telegram bot ishga tushiruvchisi
│   │   ├── locales/
│   │   │   ├── uz.json            # O'zbek tili lug'ati
│   │   │   ├── ru.json            # Rus tili lug'ati
│   │   │   └── en.json            # Ingliz tili lug'ati
│   │   ├── keyboards/
│   │   │   └── mainMenu.ts        # Telegram tugmalari va menyular
│   │   ├── handlers/
│   │   │   └── dispatcher.ts      # Xabarlar, buyruqlar va callbacklar marshruti
│   │   └── services/
│   │       ├── aiService.ts       # Gemini AI matn va rasm tahlili
│   │       ├── dbService.ts       # Foydalanuvchilar va suhbatlar bazasi
│   │       └── usageService.ts    # Rate limit va kunlik limitlar nazoratchisi
│   ├── components/                # Veb Simulyator va Admin boshqaruv komponentlari
│   ├── App.tsx                    # Asosiy veb ilova interfeysi
│   └── main.tsx                   # React kirish nuqtasi
├── server.ts                      # Express API & Webhook server
├── schema.sql                     # PostgreSQL jadvallar strukturasi
├── Dockerfile                     # Docker konteyner fayli
├── docker-compose.yml             # Bot + Postgres + Redis kompozitsiyasi
├── .env.example                   # Namuna sozlamalar
└── package.json
```

---

## ⚡ O'rnatish va Ishga Tushirish

### 1. Mahalliy (Local) ishga tushirish

```bash
# Dependencylarni o'rnatish
npm install

# .env sozlamalarini yaratish
cp .env.example .env

# Server va simulyatorni ishga tushirish
npm run dev
```

Brauzerda oching: `http://localhost:3000`

### 2. Testlarni ishga tushirish

```bash
npm test
```

### 3. Docker Compose orqali ishga tushirish

```bash
docker-compose up -d --build
```

---

## ⚙️ Sozlamalar (.env)

```env
BOT_TOKEN="123456789:ABCdefGhIJKlmNoPQRstuvwxYZ"
GEMINI_API_KEY="AIzaSy..."
DATABASE_URL="postgresql://uzai_user:uzai_secret@localhost:5432/uzai_db"
REDIS_URL="redis://localhost:6379"
ADMIN_IDS="541021808"
FREE_DAILY_LIMIT=20
PREMIUM_DAILY_LIMIT=200
```

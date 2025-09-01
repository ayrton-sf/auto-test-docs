# 🚀 Auto-Test Docs

**Document your automation suite in seconds!**  
Keep your QA and dev teams aligned with up-to-date, easy-to-read documentation.

---

## 📦 Installation

```bash
npm i
```

---

## 🛠️ Usage

### Generate docs from scratch

```bash
npm run docs
```

### Generate docs for a subset of files

```bash
npm run docs subfolder1/myTest.spec.ts subfolder1/subfolder2/myOtherTest.spec.ts
```

---

## ⚙️ Configuration

1. **Fill out your `.env` file:**
   - `INPUT_DIR`: Where your tests are located.
   - `OUTPUT_PATH`: Where `documentation.md` and `docs.json` will be output.

---

## 🗂️ How It Works

- **`docs.json`** acts as a local memory, holding summaries and services used per test.
  - _Avoid modifying this file directly._
  - Keep it updated and upload alongside your automation framework.
- **`documentation.md`** provides a readable overview for your team.

---

## 💡 Why Automatic Documentation?

- ✅ **Transparency:** Devs know exactly what is automated, helping adjust automation before app changes and increasing test reliability.
- 🤝 **Teamwork:** QA teams get a clear picture of what is completed and how it's built.
- 🚀 **Onboarding:** New team members can quickly understand the automation codebase.

---

## 📝 Output Structure

- **Folders** are headings.
- **Tests** within folders are subtitles.
- Each test gets:
  - A quick, easy-to-read summary.
  - A list of used services for maximum transparency.

---

## 🌟 Benefits

- 📖 **Readable documentation** keeps your suite healthy.
- 🔍 **Easy overview** for audits and planning.
- 🧑‍💻 **Facilitates collaboration** and knowledge sharing.

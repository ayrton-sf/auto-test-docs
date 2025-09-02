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

> **Current Limitations:**  
> Currently, Auto-Test Docs only fully supports TypeScript test frameworks that follow the architecture used by [this TypeScript based automation framework](https://github.com/damianpereira86/api-framework-ts-mocha.git).
> Regardless of future support for other frameworks and languages, we instill a specific framework structure where **Test files** make use of **Service files**, abstracting API interactions into classes that we re-use across tests.

---

## ⚙️ Configuration

- **`LLM_MODEL`**
  One of the LLMs listed in models.ts.
- **`API_KEY`**
  Anthropic or OpenAI API Key.
- **`INPUT_DIR`**
  Where your tests are located.
- **`OUTPUT_PATH`**
  Where `documentation.md` and `docs.json` will be output.
- **`DIRS_TO_CAPITALIZE`**  
   Accepts a comma-separated list of folder names (no quotes or brackets). Ensures these folders remain capitalized—useful for acronyms.
- **`DIRS_TO_KEEP_JOINED`**  
   Accepts a comma-separated list of folder names. Keeps capitalization and prevents splitting on capital letters—useful for product names.

---

## 📄 Output Files

- **`docs.json`**  
   Acts as a local memory, holding summaries and services used per test.

  - _Avoid modifying this file directly._
  - Keep it updated and upload alongside your automation framework.

- **`documentation.md`**  
   Provides a readable overview for your team.

---

## 📝 Output Structure

- **Folders** are headings.
- **Tests** within folders are subtitles.
- Each test gets:
  - A quick, easy-to-read summary.
  - A list of used services for maximum transparency.

---

## 💡 Why Automatic Documentation?

- ✅ **Transparency:** Devs know exactly what is automated, helping adjust automation before app changes and increasing test reliability.
- 🤝 **Teamwork:** QA teams get a clear picture of what is completed and how it's built.
- 🚀 **Onboarding:** New team members can quickly understand the automation codebase.

---

## 🌟 Benefits

- 📖 **Readable documentation** keeps your suite healthy.
- 🔍 **Easy overview** for audits and planning.
- 🧑‍💻 **Facilitates collaboration** and knowledge sharing.

## 🛠️ Coming Soon

- **Support for additional programming languages**
- **Enhanced flexibility for various automation frameworks** (e.g., Cypress, TestNG, etc.)

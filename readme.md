# Proyecto Pokémon - Smoke Test

This repository includes a small smoke test script to verify catching and releasing Pokémon flows.

Prerequisites:
- MongoDB running and the project's environment variables configured (if any).
- Install dependencies: `npm install`.

To run the smoke test (uses ts-node):

```bash
npm install
npx ts-node ./scripts/smokeTest.ts
```

The script will:
- Create a trainer
- Create a base Pokemon
- Catch the Pokemon (creates an owned pokemon and stores its id in the trainer)
- Release the owned Pokemon (removes id from trainer and deletes the owned document)

If you want me to run the smoke test here, tell me your DB connection details or set up a test database and I can run it for you.


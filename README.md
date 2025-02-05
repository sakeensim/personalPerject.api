#Server

## Step 1 create packagejson file
```bash
npm init - y
```

## Step 2 instal package...
```bash
npm install express nodemon cors morgan bcryptjs jsonwebtoken zod prisma 
```

## Step 3
```bash
npx prisma init
```

## Step 4 Git
```bash
git init
git add .
git commit -m "message"
```

next step
copy code from repo
only first time
(get them from github 3 line from buttom)
```bash
git remote add origin https://github.com/sakeensim/PP-api
git branch -M main
git push -u origin main
```
when update code

git add . 
git commit -m "message"
git push

## Step 5 start server
```bash
const express =require('express')
const app = express()



// Start Server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server is running on pport ${PORT}`));
```

## Step 5 Middleware
```bash
const express =require('express')
const cors =  require('cors')
const morgan = require('morgan')
const app = express()

//middleware
app.use(cors()); // Allow cross domain
app.use(morgan('dev')); // show log terminal
app.use(express.json()); // For read json



// Start Server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server is running on pport ${PORT}`));
```
# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

```text
nuxt-app\
├── app\
│   ├── app.vue                  # 主应用组件
│   └── pages\                   # 页面目录
│       ├── index.vue            # 首页
│       └── auth\                # 认证相关页面
│           ├── login.vue        # 登录页面
│           └── register.vue     # 注册页面
├── server\                      # 服务目录
│   ├── routes\                  # 服务路由目录
│       ├── register.ts          # 注册服务路由
│       ├── login.ts             # 登录服务路由
```

## Database

连接数据库有两种方式：

### 内置 nitro 数据库连接

1. 内置 nitro 数据库连接需要在 `nuxt.config.js` 中打开功能。查看示例1。
2. 手动配置数据库连接`Prisma`。查看 [Prisma 文档](https://www.prisma.io/)。

示例1：打开内置 nitro 数据库连接

```js
nitro: {
    experimental: {
      database: true,
    },
    database: {
      default: {
        connector: "postgresql",
        options: {
          url: process.env.DATABASE_URL,
        },
      },
    },
},
```

打开后，即可使用 `useDatabase` 中操作数据库。

```js
// useDatabase 不需要显示引用，打开 database 功能后即可使用。
const db = useDatabase();
// 创建用户表
await db.sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

const users = await db.sql`
    SELECT * FROM users
  `;
```

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

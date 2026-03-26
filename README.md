# 2025 Blog

> 最新引导说明：https://www.yysuni.com/blog/readme

该项目使用 Github App 管理项目内容，请保管好后续创建的 **Private key**，不要上传到公开网上。

## 1. 安装

使用该项目可以先不做本地开发，直接部署然后配置环境变量。具体变量名请看下列大写变量

```ts
export const GITHUB_CONFIG = {
	OWNER: process.env.NEXT_PUBLIC_GITHUB_OWNER || 'yysuni',
	REPO: process.env.NEXT_PUBLIC_GITHUB_REPO || '2025-blog-public',
	BRANCH: process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main',
	APP_ID: process.env.NEXT_PUBLIC_GITHUB_APP_ID || '-'
} as const
```

也可以自己手动先调整安装，可自行 `pnpm i`

## 2. 部署

这里改成 Cloudflare Workers 部署。

### 2.1 准备

先准备这些东西：

- 一个 Cloudflare 账号
- 一个已经接入 Cloudflare 的域名
- 一个你自己的 Github 仓库
- 本地 Node.js 环境
- `pnpm`
- `wrangler`

如果你本地还没装依赖，先执行：

```bash
pnpm install
```

然后登录 Cloudflare：

```bash
npx wrangler login
```

登录成功后，建议确认一下当前身份：

```bash
npx wrangler whoami
```

如果这里能看到你的 Cloudflare 账号信息，就说明后面可以继续了。

### 2.2 部署到 Workers

这个项目已经内置了 Cloudflare Workers 配置，直接执行：

```bash
pnpm run deploy
```

首次部署成功后，会拿到一个 `*.workers.dev` 地址。

如果你只是先验证项目能不能跑，到这里就够了。

如果你希望本地先看构建是否正常，也可以先执行：

```bash
pnpm run build:cf
```

它会先本地构建 OpenNext for Cloudflare，再由 `deploy` 发到 Workers。

### 2.3 绑定自定义域名

如果你要绑定自己的域名，比如 `example.com` 或 `blog.example.com`，就在 `wrangler.toml` 里配置 `routes`：

```toml
[[routes]]
pattern = "example.com"
custom_domain = true
```

然后重新执行：

```bash
pnpm run deploy
```

Cloudflare 生效后，这个域名就会直接指向你的 Worker。

如果你使用的是子域名，也可以写成这样：

```toml
[[routes]]
pattern = "blog.example.com"
custom_domain = true
```

注意：

- 根域名和子域名都可以绑
- 绑定前，先确认这个域名没有被别的站点占着
- 修改完 `wrangler.toml` 后，要重新执行一次 `pnpm run deploy`

### 2.4 Cloudflare 连接 Github 自动部署

Cloudflare 后台里有一项：

> 将您的 Worker 连接到 Git 存储库来进行自动构建和部署

这个不是必须的。

你可以这样理解：

- 只想自己本地控制发布，就不用开
- 想要每次 push 到 Github 自动发布，就开

对这个项目来说，两种方式都没问题。

我更推荐的顺序是：

1. 先把手动部署跑通
2. 确认域名、Github App、前台编辑都正常
3. 再决定要不要接 Github 自动部署

这样排查问题会简单很多。

到这里网站已经部署完成，下一步创建 Github App。

## 3. 创建 Github App 链接仓库

在 github 个人设置里面，找到最下面的 Developer Settings ，点击进入

![](https://www.yysuni.com/blogs/readme/0abb3b592cbedad6.png)

进入开发者页面，点击 **New Github App**

*GitHub App name* 和 *Homepage URL* , 输入什么都不影响。Webhook 也关闭，不需要。

![](https://www.yysuni.com/blogs/readme/71dcd9cf8ec967c0.png)

只需要注意设置一个仓库 write 权限，其它不用。

![](https://www.yysuni.com/blogs/readme/2be290016e56cd34.png)

点击创建，谁能安装这个仓库这个选择无所谓。直接创建。

![](https://www.yysuni.com/blogs/readme/aa002e6805ab2d65.png)


### 创建密钥

创建好 Github App 后会提示必须创建一个 **Private Key**，直接创建，会自动下载（不见了也不要紧，后面自己再创建再下载就行）。页面上有个 **App ID** 需要复制一下

再切换到安装页面

![](https://www.yysuni.com/blogs/readme/c122b1585bb7a46a.png)

这里一定要只**授权当前项目**。

![](https://www.yysuni.com/blogs/readme/2cf1cee3b04326f1.png)

点击安装，就完成了 Github App 管理该仓库的权限设置了。下一步就是让前端知道推送哪个项目。

这个项目默认读取下面这些配置：

```ts
export const GITHUB_CONFIG = {
	OWNER: process.env.NEXT_PUBLIC_GITHUB_OWNER || 'your-name',
	REPO: process.env.NEXT_PUBLIC_GITHUB_REPO || 'your-repo',
	BRANCH: process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main',
	APP_ID: process.env.NEXT_PUBLIC_GITHUB_APP_ID || '-'
} as const
```

如果你不会在 Cloudflare 里配环境变量，也可以直接修改仓库里的 `src/consts.ts`。

配置完成后，重新执行一次部署：

```bash
pnpm run deploy
```

如果你已经打开了 Cloudflare 的 Github 自动部署，那也可以直接 push 仓库，等它自动构建。

## 4. 完成

现在，部署的这个网站就可以开始使用前端改内容了。比如更改一个分享内容。

**提示**，网站前端页面删改完提示成功之后，如果你启用了 Cloudflare 的 Github 自动部署，就要等它自动构建完成再刷新。如果你是手动部署流，就重新执行一次 `pnpm run deploy`。

## 5. 删除

使用这个项目应该第一件事需要删除我的 blog，单独删除，批量删除已完成。

## 6. 配置

大部分页面右上角都会有一个编辑按钮，意味着你可以使用 **private key** 进行配置部署。

### 6.1 网站配置

首页有一个不显眼的配置按钮，点击就能看到现在可以配置的内容。

![](https://www.yysuni.com/blogs/readme/cddb4710e08a5069.png)

## 7. 写 blog

写 blog 的图片管理，可能会有疑惑。图片管理推荐逻辑是先点击 **+ 号** 添加图片，（推荐先压缩好，尺寸推荐宽度不超过 1200）。然后将上传好的图片直接拖入文案编辑区，这就已经添加好了，点击右上角预览就可以看到效果。

## 8. 写给非前端

非前端配置内容，还是需要一个文件指引。下面写一些更细致的代码配置。

### 8.1 移除 Liquid Grass

进入 `src/layout/index.tsx` 文件，删除两行代码，然后提交代码到你的 github
```tsx
const LiquidGrass = dynamic(() => import('@/components/liquid-grass'), { ssr: false })
// 中间省略...
<LiquidGrass /> // 第 53 行
```

![](https://www.yysuni.com/blogs/readme/f70ff3fe3a77f193.png)

### 8.2 配置首页内容

首页的内容现在只能前端配置一部分，所以代码更改在 `src/app/(home)` 目录，这个目录代表首页所有文件。首页的具体文件为  `src/app/(home)/page.tsx`

 ![](https://www.yysuni.com/blogs/readme/011679cd9bf73602.png)

这里可以看到有很多 `Card` 文件，需要改那个首页 Card 内容就可以点入那个具体文件修改。

比如中间的内容，为 `HiCard`，点击 `hi-card.tsx` 文件，即可更改其内容。

![](https://www.yysuni.com/blogs/readme/20b0791d012163ee.png)

## 9. 互助群

对于完全不是**程序员**的用户，确实会对于更新代码后，如何同步，如何**合并代码**手足无措。我创建了一个 **QQ群**（加群会简单点），或者 vx 群还是 tg 群会好一点可以 issue 里面说下就行。

QQ 群：[https://qm.qq.com/q/spdpenr4k2](https://qm.qq.com/q/spdpenr4k2)
> 不好意思，之前的那个qq群ID（1021438316），不知道为啥搜不到😂

微信群：刚建好了一个微信群，没有 qq 的可以用这个微信群
![](https://www.yysuni.com/blogs/readme/343f2c62035b8e23.webp)

tg 群：1月1号，才创建的 tg 群 https://t.me/public_blog_2025


应该主要是我自己亲自帮助你们遇到问题怎么办。（后续看看有没有好心人）

希望多多的非程序员加入 blogger 行列，web blog 还是很好玩的，属于自己的 blog 世界。

游戏资产不一定属于你的，你只有**使用权**，但这个 blog **网站、内容、仓库一定是属于你的**

#### 特殊的导航 Card

因为这个 Card 是全局都在的，所以放在了 `src/components` 目录

![](https://www.yysuni.com/blogs/readme/9780c38f886322fd.png)

## Star History

<a href="https://www.star-history.com/#YYsuni/2025-blog-public&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=YYsuni/2025-blog-public&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=YYsuni/2025-blog-public&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=YYsuni/2025-blog-public&type=date&legend=top-left" />
 </picture>
</a>

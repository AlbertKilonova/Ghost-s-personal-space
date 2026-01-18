// vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'node:fs'
import path from 'node:path'

// --- 强大的本地 CMS 插件 ---
function CmsPlugin() {
  return {
    name: 'vite-plugin-local-cms',
    configureServer(server) {
      // 1. 获取文件列表 (支持文章和作品)
      server.middlewares.use('/__cms/list', (req, res, next) => {
        if (req.originalUrl.startsWith('/__cms/list')) {
          const url = new URL(req.originalUrl, `http://${req.headers.host}`);
          const type = url.searchParams.get('type') || 'posts'; // 'posts' | 'projects'
          
          const dirMap = {
            posts: 'src/doc',
            projects: 'src/projects'
          };
          
          const targetDir = path.resolve(__dirname, dirMap[type]);
          
          // 如果目录不存在，自动创建
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }

          const files = fs.readdirSync(targetDir)
            .filter(file => file.endsWith(type === 'posts' ? '.md' : '.json'))
            .map(file => {
              const stat = fs.statSync(path.join(targetDir, file));
              return {
                filename: file,
                path: `${dirMap[type]}/${file}`, // 相对路径
                updatedAt: stat.mtimeMs // 用于排序
              }
            })
            .sort((a, b) => b.updatedAt - a.updatedAt); // 按修改时间倒序

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(files));
        } else {
          next();
        }
      });

      // 2. 读取单个文件内容
      server.middlewares.use('/__cms/read', (req, res, next) => {
        if (req.originalUrl.startsWith('/__cms/read')) {
          const url = new URL(req.originalUrl, `http://${req.headers.host}`);
          const filePath = url.searchParams.get('path');
          const fullPath = path.resolve(__dirname, filePath);

          try {
            // 安全检查
            if (!fullPath.startsWith(path.resolve(__dirname, 'src'))) throw new Error('Forbidden');
            
            const content = fs.readFileSync(fullPath, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ content }));
          } catch (e) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'File not found' }));
          }
        } else {
          next();
        }
      });

      // 3. 保存文件 (通用)
      server.middlewares.use('/__cms/save', (req, res, next) => {
        if (req.method === 'POST') {
          const body = [];
          req.on('data', chunk => body.push(chunk));
          req.on('end', () => {
            try {
              const { filePath, content } = JSON.parse(Buffer.concat(body).toString());
              const fullPath = path.resolve(__dirname, filePath);
              
              if (!fullPath.startsWith(path.resolve(__dirname, 'src'))) throw new Error('Forbidden');
              
              // 确保目录存在
              const dir = path.dirname(fullPath);
              if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

              fs.writeFileSync(fullPath, content, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
              console.log(`[CMS] Saved: ${filePath}`);
            } catch (e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
        } else {
          next();
        }
      });
      
      // 4. 删除文件
      server.middlewares.use('/__cms/delete', (req, res, next) => {
        if (req.method === 'POST') {
           const body = [];
           req.on('data', chunk => body.push(chunk));
           req.on('end', () => {
             const { filePath } = JSON.parse(Buffer.concat(body).toString());
             const fullPath = path.resolve(__dirname, filePath);
             
             if (fs.existsSync(fullPath) && fullPath.startsWith(path.resolve(__dirname, 'src'))) {
               fs.unlinkSync(fullPath);
               res.end(JSON.stringify({ success: true }));
               console.log(`[CMS] Deleted: ${filePath}`);
             } else {
               res.statusCode = 400;
               res.end(JSON.stringify({ error: 'File not found or forbidden' }));
             }
           });
        } else { next(); }
      });
      
      server.middlewares.use('/__cms/upload', (req, res, next) => {
        if (req.method === 'POST') {
          const body = [];
          req.on('data', chunk => body.push(chunk));
          req.on('end', () => {
            try {
              // 接收 { name: "1.jpg", content: "base64字符串..." }
              const { name, content } = JSON.parse(Buffer.concat(body).toString());
              
              // 1. 确保 public/uploads 目录存在
              const uploadDir = path.resolve(__dirname, 'public/uploads');
              if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
              }
              
              // 2. 生成唯一文件名 (防止同名覆盖)
              const ext = path.extname(name);
              const timestamp = Date.now();
              const filename = `${timestamp}${ext}`; // 例如: 171550000.jpg
              const targetPath = path.join(uploadDir, filename);

              // 3. 将 Base64 转换为 Buffer 并写入
              // 前端传来的 base64 通常带有 "data:image/png;base64," 前缀，需要去掉
              const base64Data = content.replace(/^data:image\/\w+;base64,/, "");
              const dataBuffer = Buffer.from(base64Data, 'base64');
              
              fs.writeFileSync(targetPath, dataBuffer);
              
              // 4. 返回 Web 可访问的路径
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                success: true, 
                url: `/uploads/${filename}` 
              }));
              
            } catch (e) {
              console.error(e);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Upload failed' }));
            }
          });
        } else {
          next();
        }
      });
    }
  }
}

export default defineConfig({
  plugins: [
    vue(),
    CmsPlugin()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import { env } from 'process';

// import fs from 'fs';
// import path from 'path';
// import child_process from 'child_process';

// const baseFolder =
//     env.APPDATA !== undefined && env.APPDATA !== ''
//         ? `${env.APPDATA}/ASP.NET/https`
//         : `${env.HOME}/.aspnet/https`;
//
// const certificateName = "financeapp.client";
// const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
// const keyFilePath = path.join(baseFolder, `${certificateName}.key`);
//
// if (!fs.existsSync(baseFolder)) {
//     fs.mkdirSync(baseFolder, { recursive: true });
// }
//
// if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
//     if (0 !== child_process.spawnSync('dotnet', [
//         'dev-certs',
//         'https',
//         '--export-path',
//         certFilePath,
//         '--format',
//         'Pem',
//         '--no-password',
//     ], { stdio: 'inherit', }).status) {
//         throw new Error("Could not create certificate.");
//     }
// }
//
// https://vitejs.dev/config/
// export default defineConfig({
//     plugins: [plugin()],
//     resolve: {
//         alias: {
//             '@': fileURLToPath(new URL('./src', import.meta.url))
//         }
//     },
//     server: {
//         proxy: {
//             // '^/weatherforecast': {
//             //     target,
//             //     secure: false
//             // },
//             '^/todos': {
//                 target,
//                 secure: false
//             }
//         },
//         port: 5173,
//         https: {
//             key: fs.readFileSync(keyFilePath),
//             cert: fs.readFileSync(certFilePath),
//         }
//     }
// })

//const target = "http://financeapp-server:8080";
// const target = "http://localhost:5080";

const target = env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : "http://localhost:5080";

export default defineConfig({
    plugins: [
        {
            name: 'requestLogger',
            configureServer(server) {
                server.middlewares.use((req, res, next,) => {
                    const timestamp = new Date().toISOString()
                    console.log(`[${timestamp}] ${req.method} ${req.url} ${res.statusCode}`);
                    next(); // Pass control to the next middleware
                });
            },
        },
        plugin()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/weatherforecast': {
                target,
                secure: false,
                changeOrigin: true,
                configure: (proxy, _options) => {
                    proxy.on('error', (err, _req, _res) => {
                        const timestamp = new Date().toISOString()
                        console.log(`[${timestamp}] ${err}`);
                    });
                },
            }
        },
        port: 3000
    },
    define: {
        'import.meta.env.VITE_TARGET':  JSON.stringify(target),
    },
    logLevel: "info"
});

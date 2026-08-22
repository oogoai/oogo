const CACHE_NAME = 'oogo-qimen-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './oogo-lf.js',
  './oogo-image.js',
  './oogo-sf.js',
  './manifest.json'
];

// 安装阶段：把所有离线文件写入本地缓存
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// 拦截请求：断网或无法翻墙时，直接从手机本地缓存读取
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

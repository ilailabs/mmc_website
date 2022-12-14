'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "manifest.json": "1261c6db8a509522120ca5dbb98d7f96",
"main.dart.js": "b3ce2f5bfbff9ce0a3e6e49d311a408f",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"version.json": "3af0b4a49b96f5c43eef1e3c28423e7f",
"assets/AssetManifest.json": "2a9509d3c515342f546a4221f35e897f",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/Poppins-Regular.ttf": "093ee89be9ede30383f39a899c485a82",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/Frame%2520853.png": "003a090df8fc8e34b4ec3f7e2337f852",
"assets/assets/name_01.png": "6dc2c34c75484fc9a4f5798fb5bac34a",
"assets/assets/footer-background.png": "31e12f6709e400701bbe7aa21edc3b7d",
"assets/assets/our_team_image_two.png": "4d761c507a5c6c45fcda78c3f13bc61c",
"assets/assets/million_logo.png": "d67db2ad8e3ba90e8db504c89622df8d",
"assets/assets/Frame%2520854.png": "c373ecb9ee78a05870e2a6ff9d09e877",
"assets/assets/ref2.txt": "d41d8cd98f00b204e9800998ecf8427e",
"assets/assets/icons/payroll.png": "b6e0da5e913e6f82a197fb22af1e6e0a",
"assets/assets/icons/company_creation.png": "59cb8c92f5fb7fa3e18bce8c3bb579ce",
"assets/assets/icons/corporate_filing.png": "26e01ba78681a2331fe22241b9df09cd",
"assets/assets/icons/lets_talk_bg.png": "31e12f6709e400701bbe7aa21edc3b7d",
"assets/assets/icons/filing.png": "eac1c09832a979d2582d8bedc5f763b2",
"assets/assets/icons/reistration.png": "0ed13e4e553adca99e32bc9f8ca21095",
"assets/assets/icons/compliance.png": "85ab82171bcde585d2bb6fdd0846e031",
"assets/assets/have_project_bg_image.png": "c2032abb999a4b184f80c860e5bf0efd",
"assets/assets/contents.json": "8317db9798d17689ef466ddc6b79a126",
"assets/assets/Mask%2520Group.png": "25ddc7ea938dd1e5b74075f6f2076540",
"assets/assets/home_page_image_one.png": "e78b78d6ff8dca9d4d7a06fdd17a484d",
"assets/assets/contents_updated.json": "fe3329b5f39f2fff1d25ba5a17f2cbec",
"assets/assets/ref.txt": "0bca57206dcfff3251dc5d7f255254bc",
"assets/assets/client_review.json": "217afd8f5dd386b390e977af0e6c45e5",
"assets/assets/page_contents.json": "0e75adac0055b40155b748d653cc1cac",
"assets/assets/our_office_image_one.png": "4d761c507a5c6c45fcda78c3f13bc61c",
"assets/assets/services.json": "8a54a7937a4bed0e1c768895a3dcd49c",
"assets/NOTICES": "b500ce2e5cf2103d56626c4ca735377a",
"assets/FontManifest.json": "3d3bbd93c030401194cf4ceedbeee9e8",
"index.html": "0bb240e738bedafdedb1bde85a332ccd",
"/": "0bb240e738bedafdedb1bde85a332ccd",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"flutter.js": "eb2682e33f25cd8f1fc59011497c35f8"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}

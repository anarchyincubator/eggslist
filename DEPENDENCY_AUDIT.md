# Eggslist Dependency Audit

**Date:** 2026-01-30
**Scope:** Backend (Python/Django) and Frontend (Node/Nuxt/Vue)

---

## 1. Python / Django (Backend)

### 1.1 Python Version

| Item | Current | Status | Recommended |
|------|---------|--------|-------------|
| Python | 3.9 (slim-bullseye) | **EOL October 2025** | 3.12 or 3.13 |

Python 3.9 reached end-of-life in October 2025. It no longer receives security patches. The Dockerfile base image `python:3.9-slim-bullseye` also uses Debian 11 (Bullseye), which reached EOL in June 2024 for standard support. Recommend updating to `python:3.12-slim-bookworm` or `python:3.13-slim-bookworm`.

### 1.2 Django Version

| Item | Current | Status | Recommended |
|------|---------|--------|-------------|
| Django | 4.0.2 | **EOL April 2023** | 4.2 LTS (supported until April 2026) or 5.2 LTS |

Django 4.0 reached end-of-life in April 2023. It has not received security patches for nearly three years. Multiple CVEs have been published for Django since 4.0.2, including:

- **CVE-2023-23969** (Django 4.0.x): Potential denial-of-service via Accept-Language headers.
- **CVE-2023-24580** (Django 4.0.x): Potential denial-of-service via file uploads.
- **CVE-2023-31047** (Django 4.0.x): Potential bypass of file upload validation via multiple files in a single form field.
- **CVE-2023-36053**: Potential ReDoS in EmailValidator/URLValidator.
- Additional CVEs in 2024 and 2025 affecting CSRF, SQL injection edge cases, and session handling.

**Upgrade path:**
- **Minimum safe target:** Django 4.2 LTS (latest 4.2.x). This is the nearest LTS release and requires the fewest code changes from 4.0. Supported until April 2026, so plan a further upgrade soon.
- **Preferred target:** Django 5.2 LTS (released April 2025, supported until April 2028). This provides the longest support window but requires stepping through deprecations from 4.0 -> 4.2 -> 5.0 -> 5.2.

### 1.3 Django REST Framework

| Item | Current | Status | Recommended |
|------|---------|--------|-------------|
| djangorestframework | 3.13.1 | Outdated (released Jan 2022) | 3.15.x |

DRF 3.13 is not formally EOL, but 3.14 and 3.15 include bug fixes, security patches, and Django 5.x compatibility. Upgrading is required before moving to Django 5.x.

### 1.4 Other Notable Backend Packages

| Package | Current | Status | Recommended | Notes |
|---------|---------|--------|-------------|-------|
| Pillow | 9.0.1 | **CRITICAL** | 11.x | Multiple CVEs since 9.0.1 including heap buffer overflows (CVE-2023-44271, CVE-2023-50447). This is the highest-priority security upgrade. |
| psycopg2-binary | 2.9.3 | Outdated | 2.9.9+ or psycopg 3.x | Minor fixes and Python 3.12+ compatibility. |
| sentry-sdk | 1.12.0 | Outdated | 2.x | Major version 2.x released in 2024. The 1.x line is in maintenance mode. |
| boto3 | 1.24.2 | Outdated | 1.35.x+ | AWS SDK releases frequently; running 2+ years behind means missing service features and bug fixes. |
| stripe | 4.2.0 | Outdated | 11.x+ | The Stripe SDK has had multiple major releases. Version 4.x is very old and may not support current Stripe API versions. |
| redis | 4.6.0 | Outdated | 5.x | Redis-py 5.0 was released in 2024 with async improvements and breaking changes. |
| gunicorn | 20.1.0 | Outdated | 22.x+ | Version 22.0 added important fixes and Python 3.12 support. |
| django-cors-headers | 3.11.0 | Outdated | 4.x | Version 4.0+ drops support for older Django, adds Django 5.x compat. |
| django-filter | 21.1 | Outdated | 24.x | Now uses CalVer. Version 23.1+ required for Django 4.2+. |
| django-storages | 1.12.3 | Outdated | 1.14.x | Needed for Django 4.2/5.x compatibility. |
| djangorestframework-simplejwt | 5.2.0 | Outdated | 5.3.x+ | Bug fixes and Django 5.x compatibility. |
| django-ckeditor-5 | 0.2.2 | Outdated | 0.2.13+ | Early version with known bugs; multiple fixes since. |
| pandas | 1.4.2 | **EOL** | 2.2.x | Pandas 1.x is no longer maintained. 2.0 introduced breaking changes (nullable dtypes, copy-on-write). |
| django-environ | 0.8.1 | Outdated | 0.11.x | Bug fixes; note: this is `django-environ`, not `environ`. Both are listed in requirements which may be redundant. |
| environ | 1.0 | Possibly redundant | Remove | The `environ` package is likely redundant alongside `django-environ`. Verify usage and consider removing. |
| django-phonenumber-field | 6.1.0 | Outdated | 8.x | Major versions 7 and 8 include Django 5.x support. |
| phonenumbers | 8.12.47 | Outdated | 8.13.x+ | Regularly updated with new phone number data. |
| requests-oauthlib | 1.3.1 | Slightly outdated | 2.0.x | Minor update available. |
| django-imagekit | 4.1.0 | Outdated | 5.0.x | Version 5.0 adds Django 4.2/5.x support. |
| django-admin-sortable2 | 2.1.3 | Outdated | 2.2.x+ | Needed for Django 4.2+ compatibility. |
| coreapi | 2.3.3 | Deprecated | Remove / replace with drf-spectacular | CoreAPI schema generation is deprecated in DRF. Consider `drf-spectacular` for OpenAPI 3.0 schema generation. |
| geoip2 | 4.5.0 | Slightly outdated | 4.8.x+ | Minor updates. |
| django-solo | 2.0.0 | OK | 2.3.x+ | Minor updates available. |
| django-summernote | 0.8.20.0 | Outdated | 0.8.20.0+ | Verify if still needed alongside CKEditor 5. May be removable. |

### 1.5 Debian Base Image

The Dockerfile uses `python:3.9-slim-bullseye` (Debian 11). Debian Bullseye standard support ended June 2024, and LTS support runs until June 2026. Recommend migrating to Bookworm (Debian 12).

---

## 2. Node / Nuxt / Vue (Frontend)

### 2.1 Nuxt 2 and Vue 2

| Item | Current | Status | Recommended |
|------|---------|--------|-------------|
| nuxt | ^2.15.8 | **EOL December 2023** | Nuxt 3.x (latest stable) |
| vue | ^2.6.14 | **EOL December 2023** | Vue 3.x |
| vue-server-renderer | ^2.6.14 | **EOL** | Built into Vue 3 |
| vue-template-compiler | ^2.6.14 | **EOL** | Not needed in Vue 3 |

Vue 2 and Nuxt 2 both reached end-of-life on December 31, 2023. They no longer receive security patches or bug fixes.

**Migration considerations for Nuxt 3 / Vue 3:**

- **Composition API:** Vue 3 uses the Composition API as the recommended pattern. Existing Options API code will still work, but the ecosystem has moved to Composition API.
- **Vuex to Pinia:** Nuxt 3 recommends Pinia over Vuex for state management. The project has substantial Vuex stores (auth, user, products, seller, categories, blog, quotes, index) that would need migration.
- **Nuxt 3 module ecosystem:** Many Nuxt 2 modules (`@nuxtjs/axios`, `@nuxtjs/proxy`, `cookie-universal-nuxt`) have Nuxt 3 equivalents or built-in replacements:
  - `@nuxtjs/axios` is replaced by `useFetch` / `$fetch` (built-in, based on ofetch/unjs).
  - `@nuxtjs/proxy` is replaced by Nitro server routes.
  - `cookie-universal-nuxt` is replaced by `useCookie` (built-in).
  - `@nuxtjs/style-resources` is replaced by Nuxt 3 Vite CSS config.
  - `@nuxtjs/dayjs` has a Nuxt 3 equivalent.
- **Vue 2 plugins:** Several Vue 2 specific packages will need replacements:
  - `vue-awesome-swiper` / `swiper@5.4.5` -- Swiper 9+ has native Vue 3 support; drop the wrapper.
  - `v-click-outside` -- Vue 3 compatible alternatives exist.
  - `v-scroll-lock` -- Needs a Vue 3 replacement.
  - `vue-observe-visibility` -- Replaced by `@vueuse/core` `useIntersectionObserver`.
  - `vue-the-mask` -- `maska` is a popular Vue 3 alternative.
  - `vue-currency-input@1.22.0` -- Version 3.x supports Vue 3.
  - `vueperslides` -- Version 3.x supports Vue 3.
- **CKEditor:** `@ckeditor/ckeditor5-vue2` should be replaced with `@ckeditor/ckeditor5-vue` (which targets Vue 3 in its latest versions).
- **Build tooling:** Nuxt 3 uses Vite by default instead of Webpack, which is a significant improvement in dev server startup time and HMR performance.
- **SSR/Static:** The current project runs as an SPA (`ssr: false`, static target). Nuxt 3 supports this mode as well, so a 1:1 migration of rendering strategy is possible.

**Estimated effort:** This is a substantial migration. Expect 4-8 weeks of engineering effort depending on team size and test coverage, given the number of pages, Vuex stores, and Vue 2-specific plugin dependencies.

### 2.2 Webpack

| Item | Current | Status | Recommended |
|------|---------|--------|-------------|
| webpack | ^4.46.0 | Outdated (Webpack 5 is current) | Remove explicit dep; Nuxt 3 uses Vite |

Webpack 4 is explicitly listed as a dependency. Nuxt 2 bundles Webpack 4 internally, so the explicit dependency is likely redundant. Webpack 4 is in maintenance mode and does not receive new features. When migrating to Nuxt 3, Vite replaces Webpack entirely, so this dependency would be removed.

### 2.3 Other Notable Frontend Packages

| Package | Current | Notes |
|---------|---------|-------|
| core-js | ^3.19.3 | Should be updated to latest 3.x for polyfill coverage. |
| lodash | ^4.17.21 | Current and stable. Consider tree-shakeable imports (`lodash-es`) in Nuxt 3. |
| sass-loader | 10.1.1 (pinned) | Pinned to 10.x for Webpack 4 compat. Nuxt 3/Vite handles Sass natively. |
| eslint | ^8.19.0 | ESLint 9.x is current with flat config. Update when migrating to Nuxt 3. |
| prettier | ^2.7.1 | Prettier 3.x is current. Minor formatting changes on upgrade. |
| @babel/eslint-parser | ^7.18.2 | Not needed with Nuxt 3 (uses native ESM). |
| babel-eslint | ^10.1.0 | Deprecated; replaced by `@babel/eslint-parser` (which is also listed). Redundant. |
| swiper | 5.4.5 (pinned) | Very outdated. Swiper 11.x is current. Pinned for `vue-awesome-swiper` compat. |

---

## 3. Recommended Upgrade Path (Prioritized)

### Priority 1 -- Critical (Security)

These packages have known CVEs or are past end-of-life without security patches. Upgrade immediately.

| # | Item | Current | Target | Reason |
|---|------|---------|--------|--------|
| 1 | **Pillow** | 9.0.1 | 11.x | Multiple critical CVEs (heap buffer overflows, DoS). |
| 2 | **Django** | 4.0.2 | 4.2 LTS (4.2.x latest) | EOL since April 2023. Multiple CVEs unpatched. |
| 3 | **Python** | 3.9 | 3.12+ | EOL since October 2025. No security patches. |
| 4 | **Debian base image** | Bullseye (11) | Bookworm (12) | Standard support ended June 2024. |
| 5 | **sentry-sdk** | 1.12.0 | 2.x | Security and compatibility fixes. |
| 6 | **stripe** | 4.2.0 | 11.x+ | Very outdated; may use deprecated Stripe API versions that could be sunset. |

**Suggested order:** Pillow can be upgraded independently with minimal risk. Django 4.0 -> 4.2 is a well-documented path (review the 4.1 and 4.2 release notes for deprecations). Python and base image upgrade should be done together. Test thoroughly after each step.

### Priority 2 -- Important (End-of-Life / Major Outdated)

These are past end-of-life or significantly outdated but may not have immediate exploitable vulnerabilities.

| # | Item | Current | Target | Reason |
|---|------|---------|--------|--------|
| 7 | **Vue 2 / Nuxt 2** | 2.x | Vue 3 / Nuxt 3 | EOL Dec 2023. No security patches. Large migration effort. |
| 8 | **pandas** | 1.4.2 | 2.2.x | 1.x series is EOL. |
| 9 | **djangorestframework** | 3.13.1 | 3.15.x | Required for Django 5.x path. |
| 10 | **django-filter** | 21.1 | 24.x | Required for Django 4.2+ compatibility. |
| 11 | **django-cors-headers** | 3.11.0 | 4.x | Required for Django 5.x path. |
| 12 | **django-phonenumber-field** | 6.1.0 | 8.x | Required for Django 5.x path. |
| 13 | **psycopg2-binary** | 2.9.3 | 2.9.9+ | Python 3.12 compatibility. |
| 14 | **gunicorn** | 20.1.0 | 22.x | Python 3.12 compatibility. |
| 15 | **redis** | 4.6.0 | 5.x | Maintenance mode. |
| 16 | **boto3** | 1.24.2 | 1.35.x+ | Very outdated; needed for current AWS API compat. |
| 17 | **django-storages** | 1.12.3 | 1.14.x | Django 4.2/5.x compatibility. |

### Priority 3 -- Nice-to-Have (Modernization)

These can wait but should be addressed during normal development cycles.

| # | Item | Current | Target | Reason |
|---|------|---------|--------|--------|
| 18 | **Django** (further) | 4.2 LTS | 5.2 LTS | Long-term support until April 2028. |
| 19 | **coreapi** | 2.3.3 | Remove; adopt drf-spectacular | CoreAPI/CoreSchema is deprecated in DRF. |
| 20 | **django-summernote** | 0.8.20.0 | Evaluate removal | Potentially redundant with CKEditor 5. |
| 21 | **environ** | 1.0 | Remove | Likely redundant with django-environ. |
| 22 | **babel-eslint** | 10.1.0 | Remove | Deprecated; `@babel/eslint-parser` is already present. |
| 23 | **Swiper** (frontend) | 5.4.5 | 11.x | Very outdated; upgrade during Nuxt 3 migration. |
| 24 | **ESLint** | 8.x | 9.x | Flat config; do during Nuxt 3 migration. |
| 25 | **Prettier** | 2.x | 3.x | Minor formatting changes. |

---

## 4. Recommended Upgrade Strategy

### Phase 1: Backend Security Hardening (1-2 weeks)

1. Upgrade Pillow to 11.x (test image upload/processing flows).
2. Upgrade Django from 4.0.2 to 4.2 LTS. Simultaneously update: django-filter, django-cors-headers, djangorestframework, djangorestframework-simplejwt, django-storages, django-phonenumber-field, django-imagekit, django-admin-sortable2.
3. Upgrade stripe SDK to latest.
4. Upgrade sentry-sdk to 2.x (review migration guide for breaking changes).
5. Update Dockerfile to `python:3.12-slim-bookworm`. Update psycopg2-binary, gunicorn, and other packages for Python 3.12 compatibility.

### Phase 2: Backend Modernization (1-2 weeks)

1. Upgrade pandas to 2.2.x (audit DataFrame usage for breaking changes).
2. Upgrade boto3, redis, remaining packages to latest.
3. Remove redundant packages (environ, coreapi, possibly django-summernote).
4. Evaluate Django 5.2 LTS upgrade path.

### Phase 3: Frontend Migration (4-8 weeks)

1. Plan Nuxt 3 / Vue 3 migration.
2. Audit and identify Vue 3 replacements for all Vue 2-only plugins.
3. Migrate Vuex stores to Pinia.
4. Replace Axios with built-in `useFetch`/`$fetch`.
5. Migrate pages and components to Composition API (can be incremental -- Options API still works in Vue 3).
6. Remove Webpack; leverage Vite (default in Nuxt 3).
7. Update all dev tooling (ESLint 9, Prettier 3, etc.).

---

## 5. Summary

The Eggslist project has significant dependency debt. The most urgent concerns are:

- **Pillow 9.0.1** has known critical security vulnerabilities and should be upgraded immediately.
- **Django 4.0.2** is over two years past end-of-life with multiple unpatched CVEs.
- **Python 3.9** reached end-of-life in October 2025.
- **Vue 2 / Nuxt 2** are past end-of-life since December 2023, affecting the entire frontend.

The backend security issues (Pillow, Django, Python) can and should be addressed within weeks. The frontend migration to Nuxt 3/Vue 3 is a larger project that requires dedicated planning and effort.

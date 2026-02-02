# Color Scheme Presets + Custom Colors

## Goal

Allow site administrators to change the entire color palette of the Eggslist frontend from the Django admin panel. Instead of only a single `primary_color` field, the branding system now supports **5 preset color schemes** (Classic, Ocean, Forest, Berry, Slate) plus a **Custom** option that unlocks individual hex color fields. The frontend reads these resolved colors from the API and applies them at runtime via CSS custom properties.

## What Changed

### Backend

**`eggslist/site_configuration/models.py`**
- Added `COLOR_SCHEME_PRESETS` — a dict mapping each preset name to 5 hex colors: `primary`, `primary_dark`, `background`, `background_light`, `text`.
- Added `COLOR_SCHEME_CHOICES` for the dropdown.
- New fields on `SiteBranding`: `color_scheme` (CharField with choices, default `"classic"`), `custom_primary`, `custom_primary_dark`, `custom_background`, `custom_background_light`, `custom_text` (all CharField, blank, max_length=7).
- Added `get_colors()` method: returns the preset dict for named schemes, or falls back to the `custom_*` fields when scheme is `"custom"`.

**`eggslist/site_configuration/admin.py`**
- Reorganized fieldsets into Text, Visuals, Color Scheme, and Custom Colors (collapsed by default).
- Added `Media` class referencing `admin/js/color_scheme_toggle.js` to auto-expand the Custom Colors fieldset when "Custom" is selected.

**`eggslist/site_configuration/static/admin/js/color_scheme_toggle.js`** *(new file)*
- Toggles the collapsed state of the Custom Colors fieldset based on the color scheme dropdown value.

**`eggslist/site_configuration/api/serializers.py`**
- Added 5 `SerializerMethodField`s to `SiteBrandingSerializer`: `color_primary`, `color_primary_dark`, `color_background`, `color_background_light`, `color_text`. These call `get_colors()` so the API always returns resolved hex values regardless of preset vs custom.
- `primary_color` is still included for backward compatibility.

**`eggslist/site_configuration/migrations/0011_sitebranding_color_scheme.py`** *(new file)*
- Adds the 6 new fields (`color_scheme`, `custom_primary`, `custom_primary_dark`, `custom_background`, `custom_background_light`, `custom_text`).

### Frontend

**`assets/sass/variables.scss`**
- Wired 5 SCSS variables to CSS custom properties with fallback defaults:
  - `$primary-marigold-dark` → `var(--brand-primary-dark, #E49006)`
  - `$primary-white` → `var(--brand-background, #FEF3E1)`
  - `$primary-cream` → `var(--brand-background-light, #FBECD5)`
  - `$primary-black` → `var(--brand-text, #282220)`
  - `$secondary-marigold` → `var(--brand-primary-dark, #DF8D06)`
- `$primary-marigold` was already wired from the prior branding work.

**`assets/sass/main.scss`**
- Added all 5 CSS custom property defaults to the `:root` block.

**`store/branding.js`**
- Added `colorPrimary`, `colorPrimaryDark`, `colorBackground`, `colorBackgroundLight`, `colorText` to state and getters.
- `setBranding` mutation reads the new `color_*` fields from the API response.
- `fetchBranding` action sets all 5 `--brand-*` CSS custom properties on `document.documentElement`.

## Preset Color Values

| Preset  | Primary   | Primary Dark | Background | Background Light | Text      |
|---------|-----------|-------------|------------|-----------------|-----------|
| Classic | `#F9AA29` | `#E49006`   | `#FEF3E1`  | `#FBECD5`       | `#282220` |
| Ocean   | `#42A5F5` | `#2196F3`   | `#E3F2FD`  | `#BBDEFB`       | `#0D253B` |
| Forest  | `#66BB6A` | `#43A047`   | `#E8F5E9`  | `#C8E6C9`       | `#1B2E1B` |
| Berry   | `#F06292` | `#EC407A`   | `#FCE4EC`  | `#F8BBD0`       | `#3E1929` |
| Slate   | `#90A4AE` | `#78909C`   | `#ECEFF1`  | `#CFD8DC`       | `#263238` |
| Relief  | `#4DB6AC` | `#26A69A`   | `#E0F2F1`  | `#B2DFDB`       | `#1A2E2B` |

## Testing Instructions

### 1. Apply the migration

```bash
make migrate
```

Or without Docker:

```bash
cd eggslist-backend
python manage.py migrate site_configuration
```

### 2. Verify the API response

```bash
curl http://localhost:8000/api/site-configuration/branding | python -m json.tool
```

Confirm the response includes `color_primary`, `color_primary_dark`, `color_background`, `color_background_light`, and `color_text` fields with hex values. The default should be Classic preset values.

### 3. Test preset switching in Django admin

1. Go to **Django Admin → Site Configuration → Site Branding**.
2. Scroll to the **Color Scheme** section.
3. Select **Ocean** from the dropdown and save.
4. Curl the branding endpoint again — values should now be the Ocean blue tones.
5. Refresh the frontend — buttons, navbar background, page backgrounds, and text should all reflect blue tones.
6. Repeat for **Forest**, **Berry**, and **Slate** to confirm each preset applies correctly.

### 4. Test custom colors

1. In the admin, select **Custom** from the Color Scheme dropdown.
2. The **Custom Colors** fieldset should expand (if collapsed, click to open it).
3. Enter arbitrary hex values (e.g., `#FF0000` for primary, `#CC0000` for primary dark, `#FFE0E0` for background, `#FFCCCC` for background light, `#330000` for text).
4. Save and curl the API — confirm your custom values appear.
5. Refresh the frontend — confirm the custom colors are applied.

### 5. Test fallback to Classic

1. Switch back to **Classic** from the dropdown and save.
2. Confirm the frontend returns to the original warm gold theme.
3. The `custom_*` field values are preserved in the database but ignored when a preset is active.

### 6. Test backward compatibility

- The `primary_color` field is still present in the API response and in the model. Existing code that reads `primary_color` will continue to work.
- The frontend `store/branding.js` still reads `primary_color` into `state.primaryColor` for any components that reference it directly.

### 7. Visual elements to check

When switching color schemes, verify these areas update:
- **Buttons and links** (primary color)
- **Button hover/active states** (primary dark)
- **Page section backgrounds** (background color)
- **Navbar (scrolled state), footer, card backgrounds** (background light)
- **Body text and headings** (text color)

### 8. Edge cases

- **Empty custom fields**: If custom is selected but a field is left blank, the Classic default for that color is used as fallback.
- **Cache**: The branding API response is cached. The `post_save` signal on `SiteBranding` clears the cache key `site_branding_api`, so changes should appear immediately after saving in admin.
- **Admin JS**: The `color_scheme_toggle.js` file must be collected into static files. If running without Docker, run `python manage.py collectstatic` after deploying.

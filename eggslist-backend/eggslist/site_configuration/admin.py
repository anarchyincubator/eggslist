from adminsortable2.admin import SortableAdminMixin
from django import forms
from django.contrib import admin
from solo.admin import SingletonModelAdmin

from eggslist.site_configuration import models
from eggslist.utils.admin import ImageAdmin


class ColorInput(forms.TextInput):
    input_type = "color"

    def format_value(self, value):
        # Return None/empty as empty string so the picker doesn't break
        if not value:
            return "#000000"
        return value


@admin.register(models.LocationCountry)
class CountryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    readonly_fields = ("slug",)


@admin.register(models.LocationState)
class StateAdmin(admin.ModelAdmin):
    list_display = ("name", "full_name", "country")
    list_select_related = ("country",)
    readonly_fields = ("slug",)


@admin.register(models.LocationCity)
class CityAdmin(admin.ModelAdmin):
    list_display = ("name", "state")
    list_select_related = ("state",)
    readonly_fields = ("slug",)
    search_fields = ("name",)
    list_filter = ("state",)


@admin.register(models.LocationZipCode)
class ZipCodeAdmin(admin.ModelAdmin):
    list_display = ("name", "city")
    list_select_related = ("city",)
    readonly_fields = ("slug",)
    search_fields = ("name", "city__name")
    list_filter = ("city__state",)


@admin.register(models.Testimonial)
class TestimonialAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ("position", "author_name", "body")


@admin.register(models.FAQ)
class FAQAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ("position", "question", "answer")


@admin.register(models.TeamMember)
class TeamMemberAdmin(SortableAdminMixin, ImageAdmin):
    list_display = ("position", "first_name", "last_name", "job_title")
    list_display_images = ("image",)


class SiteBrandingForm(forms.ModelForm):
    class Meta:
        model = models.SiteBranding
        fields = "__all__"
        widgets = {
            "custom_primary": ColorInput,
            "custom_primary_dark": ColorInput,
            "custom_background": ColorInput,
            "custom_background_light": ColorInput,
            "custom_text": ColorInput,
        }


@admin.register(models.SiteBranding)
class SiteBrandingAdmin(SingletonModelAdmin):
    form = SiteBrandingForm
    fieldsets = (
        (
            "Text",
            {
                "fields": (
                    "site_name",
                    "tagline",
                    "site_description",
                    "copyright_text",
                    "cta_text",
                )
            },
        ),
        (
            "Visuals",
            {"fields": ("logo", "favicon")},
        ),
        (
            "Color Scheme",
            {"fields": ("color_scheme",)},
        ),
        (
            "Custom Colors",
            {
                "classes": ("collapse",),
                "description": (
                    "These fields are only used when Color Scheme is set"
                    ' to "Custom".'
                ),
                "fields": (
                    "custom_primary",
                    "custom_primary_dark",
                    "custom_background",
                    "custom_background_light",
                    "custom_text",
                ),
            },
        ),
    )

    class Media:
        js = ("admin/js/color_scheme_toggle.js",)

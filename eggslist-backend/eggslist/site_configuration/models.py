from django.contrib.gis.db import models as gis_models
from django.core.cache import cache
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill
from solo.models import SingletonModel

from eggslist.utils.models import NameSlugModel, _SlugModelMixin


class LocationStateManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().select_related("country")


class LocationCityManager(gis_models.Manager):
    def get_queryset(self):
        return super().get_queryset().select_related("state__country")


class LocationZipCodeManager(gis_models.Manager):
    def get_queryset(self):
        return super().get_queryset().select_related("city__state__country")


class LocationCountry(NameSlugModel):
    class Meta:
        verbose_name = _("location country")
        verbose_name_plural = _("location countries")


class LocationState(NameSlugModel):
    country = models.ForeignKey(
        verbose_name=_("country"),
        to="LocationCountry",
        related_name="states",
        on_delete=models.CASCADE,
    )
    full_name = models.CharField(verbose_name=_("full name"), max_length=64)
    objects = LocationStateManager()

    class Meta:
        verbose_name = _("location state")
        verbose_name_plural = _("location states")


class LocationCity(_SlugModelMixin, gis_models.Model):
    name = models.CharField(verbose_name=_("name"), max_length=64)
    slug = models.SlugField(verbose_name=_("slug"), max_length=128, unique=True)
    state = models.ForeignKey(
        verbose_name=_("state"),
        to="LocationState",
        related_name="cities",
        on_delete=models.CASCADE,
    )
    location = gis_models.PointField(verbose_name=_("location"), null=True, blank=True)
    slug_field_name = "name"
    slug_field_unique = True
    objects = LocationCityManager()

    class Meta:
        verbose_name = _("location city")
        verbose_name_plural = _("location cities")

    def __str__(self):
        return self.name


class LocationZipCode(_SlugModelMixin, gis_models.Model):
    name = models.CharField(verbose_name=_("name"), max_length=64)
    slug = models.SlugField(verbose_name=_("slug"), max_length=128, unique=True)
    city = models.ForeignKey(
        verbose_name=_("city"),
        to="LocationCity",
        related_name="zip_codes",
        on_delete=models.CASCADE,
    )
    system_name = models.CharField(verbose_name=_("system name"), max_length=64, default="")
    location = gis_models.PointField(verbose_name=_("location"), null=True, blank=True)
    objects = LocationZipCodeManager()
    slug_field_name = "name"
    slug_field_unique = True

    class Meta:
        verbose_name = _("location zip code")
        verbose_name_plural = _("location zip codes")

    def __str__(self):
        return self.name


class Testimonial(models.Model):
    author_name = models.CharField(verbose_name=_("author name"), max_length=32)
    body = models.TextField(verbose_name=_("body"))
    position = models.PositiveIntegerField(default=0, blank=False, null=False)

    class Meta:
        verbose_name = _("testimonial")
        verbose_name_plural = _("testimonials")
        ordering = ("position",)

    def __str__(self):
        return f"{self.author_name} -- {self.body[:40]}..."


class FAQ(models.Model):
    question = models.CharField(verbose_name=_("question"), max_length=256)
    answer = models.TextField(verbose_name=_("answer"))
    position = models.PositiveIntegerField(default=0, blank=False, null=False)

    class Meta:
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"
        ordering = ("position",)

    def __str__(self):
        return self.question


class TeamMember(models.Model):
    first_name = models.CharField(verbose_name=_("first name"), max_length=128)
    last_name = models.CharField(verbose_name=_("last name"), max_length=128)
    image = ProcessedImageField(
        upload_to="about",
        processors=[ResizeToFill(300, 300)],
        format="JPEG",
        options={"quality": 70},
    )
    job_title = models.CharField(verbose_name=_("job title"), max_length=128)
    position = models.PositiveIntegerField(default=0, blank=False, null=False)

    class Meta:
        verbose_name = _("team member")
        verbose_name_plural = _("team members")
        ordering = ("position",)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


COLOR_SCHEME_PRESETS = {
    "classic": {
        "primary": "#F9AA29",
        "primary_dark": "#E49006",
        "background": "#FEF3E1",
        "background_light": "#FBECD5",
        "text": "#282220",
    },
    "ocean": {
        "primary": "#42A5F5",
        "primary_dark": "#2196F3",
        "background": "#E3F2FD",
        "background_light": "#BBDEFB",
        "text": "#0D253B",
    },
    "forest": {
        "primary": "#66BB6A",
        "primary_dark": "#43A047",
        "background": "#E8F5E9",
        "background_light": "#C8E6C9",
        "text": "#1B2E1B",
    },
    "berry": {
        "primary": "#F06292",
        "primary_dark": "#EC407A",
        "background": "#FCE4EC",
        "background_light": "#F8BBD0",
        "text": "#3E1929",
    },
    "slate": {
        "primary": "#90A4AE",
        "primary_dark": "#78909C",
        "background": "#ECEFF1",
        "background_light": "#CFD8DC",
        "text": "#263238",
    },
    "relief": {
        "primary": "#4DB6AC",
        "primary_dark": "#26A69A",
        "background": "#E0F2F1",
        "background_light": "#B2DFDB",
        "text": "#1A2E2B",
    },
}

COLOR_SCHEME_CHOICES = [
    ("classic", _("Classic (warm gold)")),
    ("ocean", _("Ocean (blue)")),
    ("forest", _("Forest (green)")),
    ("berry", _("Berry (raspberry)")),
    ("slate", _("Slate (gray)")),
    ("relief", _("Relief (teal)")),
    ("custom", _("Custom")),
]


class SiteBranding(SingletonModel):
    site_name = models.CharField(
        verbose_name=_("site name"), max_length=128, default="Eggslist"
    )
    tagline = models.CharField(
        verbose_name=_("tagline"), max_length=256, default="Find Farmers Near You"
    )
    site_description = models.TextField(
        verbose_name=_("site description"),
        default=(
            "Your virtual Farmer's Market, where you can buy, sell, and connect"
            " with local farmers and gardeners to keep your food fresh and local!"
        ),
    )
    primary_color = models.CharField(
        verbose_name=_("primary color (hex)"), max_length=7, default="#D4A843"
    )
    color_scheme = models.CharField(
        verbose_name=_("color scheme"),
        max_length=16,
        choices=COLOR_SCHEME_CHOICES,
        default="classic",
    )
    custom_primary = models.CharField(
        verbose_name=_("custom primary color"),
        max_length=7,
        blank=True,
        default="",
    )
    custom_primary_dark = models.CharField(
        verbose_name=_("custom primary dark color"),
        max_length=7,
        blank=True,
        default="",
    )
    custom_background = models.CharField(
        verbose_name=_("custom background color"),
        max_length=7,
        blank=True,
        default="",
    )
    custom_background_light = models.CharField(
        verbose_name=_("custom background light color"),
        max_length=7,
        blank=True,
        default="",
    )
    custom_text = models.CharField(
        verbose_name=_("custom text color"),
        max_length=7,
        blank=True,
        default="",
    )
    logo = ProcessedImageField(
        verbose_name=_("logo"),
        upload_to="branding",
        processors=[ResizeToFill(400, 400)],
        format="PNG",
        options={"quality": 90},
        blank=True,
        null=True,
    )
    favicon = models.FileField(
        verbose_name=_("favicon"), upload_to="branding", blank=True, null=True
    )
    copyright_text = models.CharField(
        verbose_name=_("copyright text"),
        max_length=256,
        default="Eggslist. All rights reserved.",
    )
    cta_text = models.CharField(
        verbose_name=_("call-to-action text"),
        max_length=256,
        default="Sign up to start buying and selling local food!",
    )

    class Meta:
        verbose_name = _("site branding")
        verbose_name_plural = _("site branding")

    def __str__(self):
        return self.site_name

    def get_colors(self):
        if self.color_scheme == "custom":
            return {
                "primary": self.custom_primary or "#F9AA29",
                "primary_dark": self.custom_primary_dark or "#E49006",
                "background": self.custom_background or "#FEF3E1",
                "background_light": self.custom_background_light or "#FBECD5",
                "text": self.custom_text or "#282220",
            }
        return COLOR_SCHEME_PRESETS.get(
            self.color_scheme, COLOR_SCHEME_PRESETS["classic"]
        )


BRANDING_CACHE_KEY = "site_branding_api"


@receiver(post_save, sender=SiteBranding)
def clear_branding_cache(sender, **kwargs):
    cache.delete(BRANDING_CACHE_KEY)

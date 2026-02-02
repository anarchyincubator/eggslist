from rest_framework import serializers

from eggslist.site_configuration import models


class StateLocationSerializer(serializers.ModelSerializer):
    country = serializers.CharField(source="country.name")

    class Meta:
        model = models.LocationState
        fields = ("slug", "name", "country")


class CityLocationSerializer(serializers.ModelSerializer):
    state = serializers.CharField(source="state.name")
    state_full_name = serializers.CharField(source="state.full_name")
    country = serializers.CharField(source="state.country.name")

    class Meta:
        model = models.LocationCity
        fields = ("slug", "name", "state_full_name", "state", "country")


class ZipCodeLocationSerializer(serializers.ModelSerializer):
    city = serializers.CharField(source="city.name")
    state = serializers.CharField(source="city.state.name")
    state_full_name = serializers.CharField(source="city.state.full_name")

    class Meta:
        model = models.LocationZipCode
        fields = ("slug", "name", "state", "state_full_name", "city")


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Testimonial
        fields = ("author_name", "body")


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FAQ
        fields = ("question", "answer")


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TeamMember
        fields = ("first_name", "last_name", "image", "job_title")


class SiteBrandingSerializer(serializers.ModelSerializer):
    color_primary = serializers.SerializerMethodField()
    color_primary_dark = serializers.SerializerMethodField()
    color_background = serializers.SerializerMethodField()
    color_background_light = serializers.SerializerMethodField()
    color_text = serializers.SerializerMethodField()

    class Meta:
        model = models.SiteBranding
        fields = (
            "site_name",
            "tagline",
            "site_description",
            "primary_color",
            "color_primary",
            "color_primary_dark",
            "color_background",
            "color_background_light",
            "color_text",
            "logo",
            "favicon",
            "copyright_text",
            "cta_text",
        )

    def _get_colors(self, obj):
        if not hasattr(obj, "_resolved_colors"):
            obj._resolved_colors = obj.get_colors()
        return obj._resolved_colors

    def get_color_primary(self, obj):
        return self._get_colors(obj)["primary"]

    def get_color_primary_dark(self, obj):
        return self._get_colors(obj)["primary_dark"]

    def get_color_background(self, obj):
        return self._get_colors(obj)["background"]

    def get_color_background_light(self, obj):
        return self._get_colors(obj)["background_light"]

    def get_color_text(self, obj):
        return self._get_colors(obj)["text"]

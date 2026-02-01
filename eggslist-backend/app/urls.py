from django.conf import settings
from django.conf.urls import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def trigger_error(request):
    division_by_zero = 1 / 0


def health_check(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path(settings.ADMIN_URL, admin.site.urls),
    path("api/", include("eggslist.urls", namespace="eggslist")),
    path("api/health/", health_check, name="health-check"),
    path("ckeditor5/", include("django_ckeditor_5.urls")),
]

if settings.DEBUG:
    urlpatterns += static.static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static.static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    try:
        from rest_framework.documentation import include_docs_urls

        from app import constants

        urlpatterns.append(
            path(
                "api/docs/",
                include_docs_urls(
                    title="Eggslist API",
                    description=constants.API_DOCS_MESSAGE,
                    schema_url="https://eggslist-dev.ferialabs.com/",
                ),
            )
        )
    except Exception:
        pass
    urlpatterns.append(path("sentry-debug/", trigger_error))

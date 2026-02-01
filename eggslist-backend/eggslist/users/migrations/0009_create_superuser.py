# Written manually by Fedor Grab on 2023-06-06 19:44

from django.conf import settings
from django.db import migrations


def generate_superuser(apps, schema_editor):
    email = getattr(settings, "DJANGO_SUPERUSER_EMAIL", "")
    password = getattr(settings, "DJANGO_SUPERUSER_PASSWORD", "")

    if not email or not password:
        print("\nDJANGO_SUPERUSER_EMAIL/PASSWORD not set — skipping superuser creation\n")
        return

    User = apps.get_model("users.User")

    if User.objects.filter(email=email).exists():
        print(f"\nSuperuser {email} already exists — skipping\n")
        return

    User.objects.create_superuser(
        email=email,
        password=password,
    )

    print("\nInitial superuser created\n")


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0010_userstripeconnection"),
    ]

    operations = [
        migrations.RunPython(generate_superuser, reverse_code=migrations.RunPython.noop)
    ]

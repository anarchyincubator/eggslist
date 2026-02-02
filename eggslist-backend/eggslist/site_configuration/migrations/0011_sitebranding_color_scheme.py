from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("site_configuration", "0010_sitebranding"),
    ]

    operations = [
        migrations.AddField(
            model_name="sitebranding",
            name="color_scheme",
            field=models.CharField(
                choices=[
                    ("classic", "Classic (warm gold)"),
                    ("ocean", "Ocean (blue)"),
                    ("forest", "Forest (green)"),
                    ("berry", "Berry (purple)"),
                    ("slate", "Slate (gray)"),
                    ("custom", "Custom"),
                ],
                default="classic",
                max_length=16,
                verbose_name="color scheme",
            ),
        ),
        migrations.AddField(
            model_name="sitebranding",
            name="custom_primary",
            field=models.CharField(
                blank=True,
                default="",
                max_length=7,
                verbose_name="custom primary color",
            ),
        ),
        migrations.AddField(
            model_name="sitebranding",
            name="custom_primary_dark",
            field=models.CharField(
                blank=True,
                default="",
                max_length=7,
                verbose_name="custom primary dark color",
            ),
        ),
        migrations.AddField(
            model_name="sitebranding",
            name="custom_background",
            field=models.CharField(
                blank=True,
                default="",
                max_length=7,
                verbose_name="custom background color",
            ),
        ),
        migrations.AddField(
            model_name="sitebranding",
            name="custom_background_light",
            field=models.CharField(
                blank=True,
                default="",
                max_length=7,
                verbose_name="custom background light color",
            ),
        ),
        migrations.AddField(
            model_name="sitebranding",
            name="custom_text",
            field=models.CharField(
                blank=True,
                default="",
                max_length=7,
                verbose_name="custom text color",
            ),
        ),
    ]

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core import mail
from django.template.loader import render_to_string

User = get_user_model()


def send_mailing(subject, mail_template, mail_object=None, users=None, email_addresses=None):
    from eggslist.site_configuration.models import SiteBranding

    emails = []

    email_addresses = email_addresses if email_addresses else [user.email for user in users]
    send_to_users = bool(users)
    site_name = SiteBranding.get_solo().site_name

    for i, email_address in enumerate(email_addresses):
        context = {"obj": mail_object or {}, "base_url": settings.SITE_URL, "site_name": site_name}

        if send_to_users:
            context.update(user=users[i])

        html_msg = render_to_string(mail_template, context=context)
        email = mail.message.EmailMessage(subject=subject, body=html_msg, to=[email_address])
        email.content_subtype = "html"
        emails.append(email)

    connection = mail.get_connection()
    connection.send_messages(emails)
    connection.close()

# Generated by Django 5.0.1 on 2024-02-27 11:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0010_solditem'),
    ]

    operations = [
        migrations.RenameField(
            model_name='solditem',
            old_name='buyer',
            new_name='seller',
        ),
    ]
# Generated by Django 5.0.1 on 2024-03-04 10:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0013_alter_solditem_seller'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='item_notification',
            field=models.CharField(max_length=100, null=True),
        ),
    ]

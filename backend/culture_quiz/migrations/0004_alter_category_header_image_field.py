# Generated by Django 5.0.6 on 2024-05-16 10:05

import culture_quiz.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('culture_quiz', '0003_alter_answer_content_alter_question_content'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='header_image_field',
            field=models.ImageField(blank=True, null=True, upload_to=culture_quiz.models.header_image_upload_path),
        ),
    ]
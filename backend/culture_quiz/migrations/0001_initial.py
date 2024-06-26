# Generated by Django 5.0.6 on 2024-05-16 08:07

import culture_quiz.models
import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50)),
                ('header_image_field', models.ImageField(upload_to=culture_quiz.models.header_image_upload_path)),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('content', models.TextField()),
                ('picture', models.ImageField(upload_to=culture_quiz.models.question_image_upload_path)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='culture_quiz.category')),
            ],
        ),
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('content', models.TextField()),
                ('is_true', models.BooleanField(default=False)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='culture_quiz.question')),
            ],
        ),
    ]

import uuid
import os
from django.db import models
from django.templatetags.static import static
from typing import Union

def header_image_upload_path(instance, filename):
    extension = os.path.splitext(filename)[1]
    return os.path.join('header_images', f"{instance.id}{extension}")

class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50)
    header_image_field = models.ImageField(upload_to=header_image_upload_path, null=True, blank=True)

    def __str__(self) -> str:
        return self.name

    @property
    def header_image(self) -> str:
        if self.header_image_field:
            return self.header_image_field.url
        else:
            return static("default_header.jpg")

def question_image_upload_path(instance, filename):
    extension = os.path.splitext(filename)[1]
    return os.path.join('question_images', f"{instance.id}{extension}")

class Question(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="questions")
    content = models.TextField()
    picture = models.ImageField(upload_to=question_image_upload_path, null=True, blank=True)

    def get_right_answer(self) -> Union["Answer", None]:
        try:
            return Answer.objects.get(question=self, is_true=True)
        except Answer.DoesNotExist:
            return None

class Answer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="answers")
    content = models.CharField(max_length=100)
    is_true = models.BooleanField(default=False)
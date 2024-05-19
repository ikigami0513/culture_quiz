from django.contrib import admin
from .models import *

class QuestionInline(admin.TabularInline):
    model = Question
    extra = 0

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    inlines = [QuestionInline]

class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 10

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['id', 'content']
    inlines = [AnswerInline]
from django.contrib import admin
from .models import Todo

'''
    Esse arquivo serve para configurar a administração 
    do django rest framework para esse modelo.

    Servirá essencialmente para testes.

    Dentro da classe tem um atributo list_display que 
    contém uma tupla com os nomes de cada campo desse modelo.
'''


class TodoAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'completed')

# Register your models here.


admin.site.register(Todo, TodoAdmin)

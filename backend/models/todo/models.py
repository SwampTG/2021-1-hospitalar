from django.db import models

# Create your models here.

'''
    Definição desse modelo.

    Adicione na classe um atributo e 
    especifique o tipo de cada um.

    Reescreva a função __str__ para que ela retorne alguma 
    informação útil sobre o modelo.

    @see https://docs.djangoproject.com/en/3.2/topics/db/models/
'''


class Todo(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

from rest_framework import serializers
from .models import Todo

'''
    Classe em que é implementado o serializer, serve para transformar 
    JSON em uma estrutura python e vice versa.
    
    Herda HyperlinkedModelSerializer.

    O atributo fields deve conter 'id'
    e o nome de todos os atibutos de model.

    @see https://www.django-rest-framework.org/tutorial/1-serialization/#creating-a-serializer-class
'''


class TodoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Todo
        fields = ('id', 'title', 'description', 'completed')

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Todo
from .serializers import TodoSerializer

# Create your views here.

'''
    Cria as views desse modelo.

    Views são equivalentes aos controllers do Node, etc.

    Herda a classe ModelViewSet que cria o CRUD automaticamente.

    Para poder criar uma view manualmente use o decorador @action(),
    action sempre espera que o programador especifique os parâmetros methods e detail.

    methods é uma lista com os métodos de requisição compatíveis com essa view 
    (get, post, put, delete).

    detail é um booleano que especifica se essa função deve receber um só item 
    ou se deve trabalhar com todos os itens cadastrados.

    O nome da função será igual ao caminho url para executa-la.

    @see https://www.django-rest-framework.org/tutorial/3-class-based-views/
'''


class TodoView(viewsets.ModelViewSet):

    serializer_class = TodoSerializer
    queryset = Todo.objects.all()

    @action(methods=['get'], detail=False)
    def get_completed(self, request):
        todos = Todo.objects.filter(completed=True)

        serializer = self.get_serializer(todos, many=True)

        return Response(serializer.data)

    @action(methods=['put'], detail=True)
    def complete(self, request, pk=None):
        todo = self.get_object()
        serializer = self.get_serializer(
            todo, data={"completed": True}, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

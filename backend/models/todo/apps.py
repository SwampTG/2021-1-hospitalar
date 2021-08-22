from django.apps import AppConfig

'''
    Não esqueça de sempre modificar o atributo name
    para que o django encontre esse modelo que está dentro da pasta models.

    Vide backend.md.
'''


class TodoConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'models.todo'

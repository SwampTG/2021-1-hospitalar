from rest_framework import serializers
from .models import Avaliacao, Checklist


class ChecklistSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Checklist
        fields = ('id', 'avaliacao', 'secao', 'indice', 'qualificacao',
                  'avaliacao_item', 'rota', 'comentario', 'status')
        read_only_fields = ('avaliacao',)


class AvaliacaoSerializer(serializers.ModelSerializer):
    analise = ChecklistSerializer(many=True)

    class Meta:
        model = Avaliacao
        fields = ('id', 'analise', 'hospital', 'responsavel')

    def create(self, validated_data):
        '''
            Esse método será executado ao fazer uma requisição POST e deverá criar
            uma nova avaliação de acordo com o JSON passado no corpo da requisição.
            Esse método se faz necessário pois o ModelSerializer não é capaz de
            criar essa funcionalidade automaticamente quando a classe tem alguma
            relação com outra classe.

            O campo analise desta classe é uma lista do objeto Checklist, ilustrando 
            assim uma relação de composição.

            Parâmetro: 
                validated_data: Objeto que representa o JSON passado como corpo da
                                requisição.

            Retorno:
                O objeto criado.
        '''

        analise = validated_data.pop('analise')
        avaliacao = Avaliacao.objects.create(**validated_data)
        for linha in analise:
            Checklist.objects.create(**linha, avaliacao=avaliacao)

        return avaliacao

    def update(self, instance, validated_data):
        '''
            Esse método será executado ao fazer uma requisição PUT e deverá atualizar
            a avaliação cujo id seja igual ao id passado pelo parâmetro da requisição.

            Parâmetros: 
                instance: Objeto a ser editado.
                validated_data: Objeto que representa o JSON passado como corpo da
                                requisição.

            Retorno:
                O objeto já editado.

            PS: Para editar uma avaliação, o corpo da requisição deve conter o campo
                analise pois este será usado para identificar quais analises criar, 
                editar ou destruir. As analises, passadas para o JSON, que tiverem ID 
                serão editadas, as que não tiverem ID serão criadas e as que existirem 
                no objeto mas não existirem na requisição serão apagadas.
        '''

        analise = validated_data.pop('analise')

        instance.hospital = validated_data.get("hospital", instance.hospital)
        instance.responsavel = validated_data.get(
            "responsavel", instance.responsavel)

        instance.save()

        keep_analises = []
        for linha in analise:

            if "id" not in linha.keys():
                c = Checklist.objects.create(**linha, avaliacao=instance)
                keep_analises.append(c.id)

            else:
                if Checklist.objects.filter(id=linha["id"]).exists():
                    c = Checklist.objects.get(id=linha["id"])

                    c.avaliacao = linha.get('avaliacao', c.avaliacao)
                    c.secao = linha.get('secao', c.secao)
                    c.indice = linha.get('indice', c.indice)
                    c.qualificacao = linha.get('qualificacao', c.qualificacao)
                    c.avaliacao_item = linha.get(
                        'avaliacao_item', c.avaliacao_item)
                    c.rota = linha.get('rota', c.rota)
                    c.comentario = linha.get('comentario', c.comentario)
                    c.status = linha.get('status', c.status)

                    c.save()
                    keep_analises.append(c.id)
                else:
                    continue

        for linha in instance.analise:
            if linha.id not in keep_analises:
                linha.delete()

        return instance

import { Card, CardActions, Grid, IconButton } from '@material-ui/core'
import { AddCircleRounded as AddIcon } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import { api } from '../../api'
import { Header } from '../../components/GlobalComponents/Header'
import { TodoCard } from '../../components/HomePageComponents/TodoCard'
import { TodoForm } from '../../components/HomePageComponents/TodoForm'

/**
 * Definição do tipo TodoItem.
 * Observe que os seus campos são exatamente iguais
 * aos campos cadastrados desse modelo no backend.
 *
 * Export está presente porque precisamos que
 * um outro arquivo tenha esse tipo definido.
 */
export type TodoItem = {
  id: number
  title: string
  description: string
  completed: boolean
}

/**
 * Um componente funcional React compatível com React Hooks.
 * Siga o padrão descrito no markdown do frontend.
 *
 * @returns JSX.Element
 * @see https://pt-br.reactjs.org/docs/hooks-reference.html#basic-hooks
 */
export const Home: React.FC = () => {
  const [todoList, setTodoList] = useState<TodoItem[]>([])
  const [modal, setModal] = useState<boolean>(false)

  /**
   * Função para requisitar as informações do banco de dados
   * e atualizar a lista de Todos.
   *
   * Note que o tipo da resposta da requisição é uma array de Todos
   * TodoItem[].
   *
   * Os dados da resposta sempre estarão no campo data (response.data).
   */
  const refreshList = () => {
    api
      .get<TodoItem[]>('todo/')
      .then(({ data }) => setTodoList(data))
      .catch(console.log)
  }

  /**
   * React hook que serve para executar uma ação e atualizar a página.
   *
   * Note que o primeiro parâmetro é uma função
   * e o segundo parâmetro é uma array vazia.
   *
   * A array vazia serve como indicação para que
   * esse hook seja executado somente uma vez.
   */
  useEffect(refreshList, [])

  /**
   * Função que muda a variável modal de true para false e vice versa.
   */
  const toggle = () => {
    setModal(!modal)
  }

  /**
   * Função para deletar uma informação do banco de dados.
   *
   * Note que a url da requisição contém o valor de uma variável,
   * essa string é uma template string.
   *
   * Note também que a api ordena que a página seja atualizada
   * depois de terminar a operação.
   *
   * @param item O item que deseja deletar
   * @see https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Template_literals
   */
  const handleDelete = (item: TodoItem) => {
    api.delete(`todo/${item.id}/`).then(refreshList).catch(console.log)
  }

  /**
   * Função para editar um item no banco de dados.
   * Essa função inverte a informação presente no campo 'completed'.
   *
   * Note que a função put usa uma template string
   * como primeiro parâmetro e um objeto como segundo,
   * o objeto é uma cópia do item com algumas informações alteradas.
   *
   * Note também que a api ordena que a página seja atualizada
   * depois de terminar a operação.
   *
   * @param item O item que deseja alterar
   */
  const handleEdit = (item: TodoItem) => {
    item.completed = !item.completed
    api.put(`todo/${item.id}/`, item).then(refreshList).catch(console.log)
  }

  /**
   * Função para cadastrar um novo item no banco de dados.
   *
   * Note que a função post recebe um objeto como segundo parâmetro,
   * esse objeto será adicionado ao banco de dados.
   *
   * Note também que a api ordena que a página seja atualizada
   * depois de terminar a operação.
   *
   * @param item O item que deseja cadastrar
   */
  const handleCreate = (item: TodoItem) => {
    api.post('todo/', item).then(refreshList).catch(console.log)
    toggle()
  }

  /**
   * Cria os cards de Todo usando as informações
   * de todos os objetos na lista de Todos.
   *
   * @return JSX.Element[]
   */
  const generateList = () => {
    return todoList.map((value, index) => (
      <TodoCard
        key={index}
        value={value}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    ))
  }

  /**
   * Cria o card usado para adicionar novos Todos.
   *
   * @return JSX.Element
   */
  const generateAddCard = () => {
    return (
      <Grid item xs={12} sm={4}>
        <Card>
          <CardActions>
            <IconButton onClick={toggle}>
              <AddIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
    )
  }

  /**
   * A página foi criada utilizando a ferramenta de layout responsivo do material-ui
   * @see https://material-ui.com/components/grid/
   */
  return (
    <Grid container direction='column' spacing={2}>
      {/*Note que código comum pode ser escrito no JSX desde que esteja entre chaves*/}
      <Grid item>
        <Header title='Home' />
      </Grid>
      <Grid item container>
        <Grid item xs={false} sm={2} />
        <Grid item xs={12} sm={8}>
          <Grid container spacing={2}>
            {generateList()}
            {generateAddCard()}
            {modal && <TodoForm toggle={toggle} handleSave={handleCreate} />}
          </Grid>
        </Grid>
        <Grid item xs={false} sm={2} />
      </Grid>
    </Grid>
  )
}

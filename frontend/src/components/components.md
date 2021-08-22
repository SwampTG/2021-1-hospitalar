# Padrões

- Prefira colocar na página e não nos componentes as funções que mexem no BD.
- Passe os parâmetros do componente de acordo com esse padrão:

  ```
      type Props = {
          os parâmetros e seus tipos
      }

      export const (Nome):React.FC<Props> = ({os parâmetros}) => {
          return ...
      }
  ```

- Para tipar os parâmetros cujo tipo seja uma função, use esse modelo:

  ```
      type Props = {
          parâmetro:(os parâmetros tipados dessa função)=>(o retorno dessa função)
      }

      ex:
        type Props = {
            handleDelete:(item:TodoItem)=>void
        }
  ```

- Caso for utilizar o ...rest não esqueça de adicionar os tipos do componente que você quer modificar.
  - Ex: Olhe o component GlobalComponents/Button

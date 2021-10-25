import { CONFIG, api } from '../../api'
import { FormGroup, Grid, IconButton, Typography } from '@material-ui/core'
import React, { useContext, useState, useEffect } from 'react'

import AuthContext from '../../context/auth'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { Avaliacao } from '../../types/Avaliacao'
import { Button } from '../../components/GlobalComponents/Inputs/Button'
import { DatePicker } from '../../components/GlobalComponents/DatePicker'
import { Form } from '../../components/GlobalComponents/Forms/Form'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import Logo from '../../assets/logo-2021-v2.png'
import { Template } from '../../components/GlobalComponents/Template'
import TextField from '@material-ui/core/TextField'
import { Usuario } from '../../types/Usuario'
import { useStyles } from './styles'

export function NovaAvaliacao(): React.ReactElement {
  const classes = useStyles()
  const context = useContext(AuthContext)

  const blankUser: Usuario = {
    username: 'null',
    email: 'null',
    tipo: 'null',
    funcao: 'null',
    organizacao: 'null',
  }

  const [nomeHospital, setNomeHospital] = useState('')
  const [sigla, setSigla] = useState('')
  const [codigo, setCodigo] = useState('')
  const [data, setData] = useState<Date | null>(new Date())
  const [users, setUsers] = useState<Usuario[]>([blankUser])
  const [idsAvaliadores, setIdsAvaliadores] = useState('')

  // Caso não precise, deletar após testes!

  const handleSave = () => {
    const avaliacao: Avaliacao = {
      codigo,
      nomeHospital: `${nomeHospital},${sigla}`,
      idsAvaliadores,
      data: data ? data.toISOString() : new Date().toISOString(),
      configuracao: {},
      secoes: [],
    }

    api.post('avaliacao/', avaliacao, CONFIG(context.token)).catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      alert('O código dessa avaliação já está sendo usado')
    })
  }

  const generateForm = () => {
    useEffect(() => {
      api
        .get<Usuario[]>('usuario/')
        .then((response) => {
          setUsers([...response.data])
          // eslint-disable-next-line no-console
          console.log(response.data)
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error)
        })
    }, [])

    return (
      <FormGroup>
        <Grid
          container
          direction='row'
          spacing={2}
          justifyContent='space-between'
          alignContent='center'
          className={classes.formContainer}
        >
          <Grid item container direction='column' xs={12} md={6} lg={4}>
            <Typography className={classes.avaliadorTitle}> Avaliadores </Typography>
            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option: any) => option.username}
              getOptionSelected={(option: any, value) => option.id === value.id}
              renderInput={(params: any) => (
                <TextField
                  className={classes.inputText}
                  {...params}
                  variant='standard'
                  label='Escolha os Avaliadores'
                  placeholder='Avaliadores'
                />
              )}
              onChange={(event, values) => {
                event.preventDefault()
                let concatIds = ''
                values.forEach((val, index) => {
                  if (index === 0) {
                    concatIds = concatIds.concat(val.id.toString())
                  } else {
                    concatIds = concatIds.concat(',', val.id.toString())
                  }
                })
                setIdsAvaliadores(concatIds)

                // eslint-disable-next-line no-console
                console.log(values)
              }}
            />
            <Button
              onClick={handleSave}
              color='secondary'
              className={classes.generateBtn}
            >
              GERAR
            </Button>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Grid>
              <Typography className={classes.avaliadorTitle}> Hospital </Typography>
              <TextField
                className={classes.inputText}
                variant='standard'
                label='Digite o Hospital'
                placeholder='Nome'
                value={nomeHospital}
                onChange={(event) => {
                  event.preventDefault()
                  setNomeHospital(event.target.value)
                }}
              />
            </Grid>
            <Grid>
              <Typography className={classes.avaliadorTitle}> Sigla </Typography>
              <TextField
                className={classes.inputText}
                variant='standard'
                label='Digite a Sigla do Hospital'
                placeholder='Sigla'
                value={sigla}
                onChange={(event) => {
                  event.preventDefault()
                  setSigla(event.target.value)
                }}
              />
            </Grid>
            <Grid>
              <Typography className={classes.avaliadorTitle}> Data </Typography>
              <DatePicker data={data} setData={setData} />
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Grid>
              <img alt='Logo FAMil' src={Logo} className={classes.imgLogo} />
            </Grid>
            <Grid>
              <Typography className={classes.avaliadorTitle}> Código </Typography>
              <TextField
                className={classes.inputText}
                variant='standard'
                label='Código da Avaliação'
                placeholder='Código'
                value={codigo}
                onChange={(event) => {
                  event.preventDefault()
                  setCodigo(event.target.value)
                }}
              />
            </Grid>
          </Grid>
          <Grid item container direction='row' xs={12}>
            <Button
              onClick={handleSave}
              color='secondary'
              className={classes.generateBtn2}
              size='large'
            >
              GERAR
            </Button>
          </Grid>
        </Grid>
      </FormGroup>
    )
  }

  return (
    <Template>
      <Grid
        container
        direction='column'
        alignItems='flex-start'
        className={classes.container}
      >
        <Grid
          item
          container
          direction='row'
          className={classes.titleContainer}
          justifyContent='space-between'
        >
          <Grid item xs={6} md={8} lg={8}>
            <Typography variant='h5' className={classes.title}>
              {' '}
              Gerar Novo Relatório{' '}
            </Typography>
          </Grid>
          <IconButton color='secondary' edge='start' className={classes.helpIcon}>
            <HelpOutlineIcon fontSize='large' />
          </IconButton>
        </Grid>
        <Form>{generateForm()}</Form>
      </Grid>
    </Template>
  )
}

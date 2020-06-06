import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650
  },
  icon: {
    marginRight: theme.spacing(2)
  },
  visibilityIcon: {
    color: 'orange'
  },
  personAddOutlinedIcon: {
    color: 'white'
  },
  editIcon: {
    color: 'lightseagreen'
  },
  deleteForeverIcon: {
    color: 'orangered'
  },
  toolbar: {
    justifyContent: 'space-between'
  },
  toolbarDiv: {
    display: 'flex',
    alignItems: 'center'
  },
  notFoundImage: {
    marginTop: 55,
    width: '100%',
    height: 500
  },
  paragraphNotFound: {
    width: '100%',
    textAlign: 'center',
    fontSize: 20
  }
}))

export default useStyles

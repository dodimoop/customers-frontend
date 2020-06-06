import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  Snackbar,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Tooltip,
  FormHelperText
} from '@material-ui/core/'
import Axios from 'axios'
import dateFormat from 'dateformat'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import {
  VerifiedUserOutlined as VerifiedUserOutlinedIcon,
  Visibility as VisibilityIcon,
  DeleteForever as DeleteForeverIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  PersonAddOutlined as PersonAddOutlinedIcon
} from '@material-ui/icons/'

import Style from '../src/style'

const Index = () => {
  // State
  const [customers, setCustomers] = useState([])
  const [open, setOpen] = useState(false)
  const [validation, setValidation] = useState({})
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState({})
  const [openDetails, setOpenDetails] = useState(false)

  // State to add customer
  const [onAddCustomer, setOnAddCustomer] = useState(false)

  // State to edit customer
  const [customerEdit, setCustomerEdit] = useState({})
  const [openEdit, setOpenEdit] = useState(false)

  // Use Effect
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await Axios.get(
          'http://localhost:5000/api/v1/customers'
        )
        setCustomers(response.data.result)
      } catch (error) {
        console.log(error)
      }
    }
    fetchCustomer()
  }, [customers])

  // onClick Delete Button Icon
  const isDeleteIcon = customer => {
    setValidation(customer)
    setOpen(true)
  }

  // Handle close Dialog
  const handleClose = () => {
    setOpen(false)
    setOpenDetails(false)
    setOpenEdit(false)
    setOnAddCustomer(false)
  }

  // on Click is Agree will remove customer permanent
  const isAgree = async () => {
    setOpenSnackbar(true)
    const removeCustomer = await Axios.delete(
      `http://localhost:5000/api/v1/customers/${validation.id}`
    )
    setMessage(removeCustomer.data.status.message)
    setOpen(false)
  }

  // Onclick Button View
  const isViewDetail = customer => {
    setDetails(customer)
    setOpenDetails(true)
  }

  const isEditCustomer = customer => {
    setOpenEdit(true)
    setCustomerEdit(customer)
  }

  const isAddCustomer = () => {
    setOnAddCustomer(true)
  }

  // Use formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: onAddCustomer ? '' : customerEdit.name,
      email: onAddCustomer ? '' : customerEdit.email,
      password: onAddCustomer ? '' : '',
      gender: onAddCustomer ? '' : customerEdit.gender,
      is_married: onAddCustomer ? '' : customerEdit.is_married,
      address: onAddCustomer ? '' : customerEdit.address
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('This fill is required!'),
      email: Yup.string().required('This fill is required!'),
      password: Yup.string().required('This fill is required!'),
      gender: Yup.string().required('This fill is required!')
    }),
    validateOnChange: true,
    onSubmit: async values => {
      if (onAddCustomer) {
        const sentAddDataCustomer = await Axios.post(
          'http://localhost:5000/api/v1/customers/create',
          values
        )
        setOnAddCustomer(false)
        setMessage(sentAddDataCustomer.data.status.message)
        setOpenSnackbar(true)
      } else {
        const sentDataEdit = await Axios.put(
          `http://localhost:5000/api/v1/customers/${customerEdit.id}`,
          values
        )
        setOpenEdit(false)
        setMessage(sentDataEdit.data.status.message)
        setOpenSnackbar(true)
      }
    }
  })

  const classes = Style()

  return (
    <>
      <CssBaseline />
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.toolbarDiv}>
            <VerifiedUserOutlinedIcon className={classes.icon} />
            <Typography variant="h6" color="inherit" noWrap>
              My Customers
            </Typography>
          </div>
          <div className={classes.search}>
            <Tooltip title="Add Customer" aria-label="add">
              <IconButton
                aria-label="view detail customer"
                className={classes.personAddOutlinedIcon}
                onClick={isAddCustomer}
              >
                <PersonAddOutlinedIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
      <div style={{ padding: 20 }}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">No.</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Gender</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer, idx) => (
                <TableRow key={customer.id}>
                  <TableCell align="center">{idx + 1}</TableCell>
                  <TableCell align="center">{customer.name}</TableCell>
                  <TableCell align="center">{customer.email}</TableCell>
                  <TableCell align="center">{customer.gender}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="view detail customer"
                      className={classes.visibilityIcon}
                      onClick={() => isViewDetail(customer)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      aria-label="view detail customer"
                      className={classes.editIcon}
                      onClick={() => isEditCustomer(customer)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="remove customer"
                      className={classes.deleteForeverIcon}
                      onClick={() => isDeleteIcon(customer)}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Dialog */}
      <div>
        <Dialog
          // fullScreen={fullScreen}
          open={openDetails || open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {openDetails === true ? 'Customer Details' : 'Remove Customer?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {openDetails === true ? (
                <span>
                  <span>
                    <b>Name:</b> {details.name}
                  </span>
                  <br />
                  <span>
                    <b>Email:</b> {details.email}
                  </span>
                  <br />
                  <span>
                    <b>Gender:</b> {details.gender}
                  </span>
                  <br />
                  <span>
                    <b>Status:</b> {details.is_married}
                  </span>
                  <br />
                  <span>
                    <b>Address:</b> {details.address}
                  </span>
                  <br />
                  <span>
                    <b>Last Updated:</b>{' '}
                    {dateFormat(details.updatedAt, 'dd-mm-yyyy')}
                  </span>
                </span>
              ) : (
                `Are you sure want remove ${validation.name} user?`
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {openDetails === true ? (
              ''
            ) : (
              <Button autoFocus onClick={handleClose} color="primary">
                Disagree
              </Button>
            )}

            {openDetails === true ? (
              <Button onClick={handleClose} color="primary" autoFocus>
                Close
              </Button>
            ) : (
              <Button onClick={isAgree} color="primary" autoFocus>
                Agree
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </div>

      {/* Dialog to Edit Customer */}
      <Dialog
        open={onAddCustomer || openEdit}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {onAddCustomer ? 'Add' : 'Edit'} Customer
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {onAddCustomer ? (
              <>
                This form is used to add customer data, please fill in your
                customer data! <br />
                <br />
                <b>Note:</b> Name, Email, Password and Gender must be fill!
              </>
            ) : (
              <>
                This form is used to change customer data, please fill in your
                customer data! <br />
                <br />
                <b>Note:</b> For data security, the password must be input
                again. thank you!
              </>
            )}
          </DialogContentText>
          <TextField
            // autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            required
            fullWidth
            helperText={
              formik.errors.name && formik.touched.name && formik.errors.name
            }
            onBlur={formik.handleBlur}
            error={formik.errors.name && formik.touched.name}
          />
          <TextField
            margin="dense"
            id="email"
            label="email"
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            fullWidth
            required
            helperText={
              formik.errors.email && formik.touched.email && formik.errors.email
            }
            onBlur={formik.handleBlur}
            error={formik.errors.email && formik.touched.email}
          />
          <TextField
            margin="dense"
            id="password"
            label="password"
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            required
            fullWidth
            helperText={
              formik.errors.password &&
              formik.touched.password &&
              formik.errors.password
            }
            onBlur={formik.handleBlur}
            error={formik.errors.password && formik.touched.password}
          />
          <FormControl
            className={classes.formControl}
            fullWidth
            error={formik.errors.gender && formik.touched.gender}
          >
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
            <Select
              labelId="gender"
              id="gender"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              required
              onBlur={formik.handleBlur}
            >
              <MenuItem value="Men">Men</MenuItem>
              <MenuItem value="Women">Women</MenuItem>
            </Select>
            <FormHelperText>
              {formik.errors.gender &&
                formik.touched.gender &&
                formik.errors.gender}
            </FormHelperText>
          </FormControl>
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel id="demo-simple-select-label">
              Status Married
            </InputLabel>
            <Select
              labelId="is_married"
              id="is_married"
              name="is_married"
              value={formik.values.is_married}
              onChange={formik.handleChange}
            >
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Divorced">Divorced</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            id="address"
            label="address"
            type="textarea"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={formik.handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={openSnackbar}
          autoHideDuration={1500}
          onClose={() => {
            setOpenSnackbar(false)
          }}
          message={message}
          action={
            <>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
        />
      </div>
    </>
  )
}

export default Index

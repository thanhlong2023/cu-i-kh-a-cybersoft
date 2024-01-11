import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import AssessmentIcon from '@mui/icons-material/Assessment'
import { Link, useNavigate } from 'react-router-dom'
// import { useAppSelector } from '~/redux/hooks'
import { getLocal, removeLocal } from '~/utils'
import { ACCESS_TOKEN, Avatar_signined, Email_signined } from '~/constants'
import { useDispatch } from 'react-redux'
import { setLogin } from '~/redux/userSlice'

const pages = ['Các không gian làm việc', 'Gần đây', 'Đã đánh dấu sao']
const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

function Show({ when, fallback, children }) {
  return when ? children : fallback
}

function ResponsiveAppBar() {
  let email = ''
  let ava = ''
  if (Email_signined) {
    email = getLocal(Email_signined)
    ava = getLocal(Avatar_signined)
  }
  // const { login } = useAppSelector((rootReducer) => rootReducer.userReducer)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <AppBar
      position="static"
      sx={{
        borderBottom: '0.1px #2e3b5223 solid',
        position: 'fixed',
        zIndex:'10'
      }}
    >
      <Container maxWidth="xl" sx={{ background: '#1976d2', color: 'white' }}>
        <Toolbar disableGutters>
          <AssessmentIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 900,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            TRELLO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AssessmentIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 900,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            TRELLO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 1,
                  color: 'white',
                  display: 'block',
                  fontWeight: '550'
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={ava} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box> */}
          <div>
            <Show
              when={email}
              fallback={
                <Link to="login" className="btn btn-outline-light mx-2">
                  Login
                </Link>
              }
            >
              <span style={{ color: 'white' }}>
                {email}
              </span>
            </Show>

            <Show
              when={!email}
              fallback={
                <button
                  onClick={() => {
                    // 1. Chuyen ve trang login
                    navigate('')
                    // 2. Xoa localstorage
                    removeLocal(ACCESS_TOKEN)
                    // 3. Remove tren redux;
                    removeLocal(Email_signined)
                    dispatch(
                      setLogin({
                        email: ''
                      })
                    )
                  }}
                  className="btn btn-outline-light mx-2"
                >
                  Logout
                </button>
              }
            >
              <Link to="register" className="btn btn-outline-light mx-2">
                Register
              </Link>
            </Show>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default ResponsiveAppBar

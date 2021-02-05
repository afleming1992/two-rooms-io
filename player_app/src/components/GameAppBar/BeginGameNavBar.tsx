import React from 'react';
import {IconButton, ListItemIcon, makeStyles, Menu, MenuItem, Typography} from "@material-ui/core";
import {AppState} from "../../redux/reducers";
import {connect, useDispatch} from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCrown, faForward} from "@fortawesome/free-solid-svg-icons";
import {nextRound} from "../../redux/actions/gameActionCreators";

interface BeginGameNavBarProps {
  isHost: boolean
}

const useStyles = makeStyles((theme) => ({
  title: {
    flex: 1,
    display: 'block'
  },
  sectionDesktop: {
    display: 'flex'
  }
}));

const BeginGameNavBar: React.FC<BeginGameNavBarProps> = ({isHost}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleAdminMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAdminMenu = () => {
    setAnchorEl(null);
  }

  const dispatch = useDispatch();

  return (
    <>
      <Typography className={classes.title} variant="h6" noWrap>
        Welcome!
      </Typography>
      <div>
      </div>
      {
        isHost && (
          <div>
            <IconButton onClick={handleAdminMenu}>
              <FontAwesomeIcon icon={faCrown} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={open}
              onClose={handleCloseAdminMenu}
              id="adminmenu-appbar">
              <MenuItem onClick={() => dispatch(nextRound())}><ListItemIcon><FontAwesomeIcon icon={faForward} /></ListItemIcon>Start Game</MenuItem>
            </Menu>
          </div>
        )
      }
    </>
  );
}

const mapStateToProps = (state: AppState) => {
    return {
      isHost: state.game.host?.userToken === state.player.userToken
    }
}

export default connect(mapStateToProps)(BeginGameNavBar);